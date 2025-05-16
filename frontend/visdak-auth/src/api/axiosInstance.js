import axios from "axios";

import { removeAuthCookies } from "../utils/auth";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Debug logging configuration
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
const log = {
  info: (...args) => DEBUG && console.log("🔵", ...args),
  warn: (...args) => DEBUG && console.warn("🟡", ...args),
  error: (...args) => DEBUG && console.error("🔴", ...args),
  refresh: (...args) => DEBUG && console.log("🔄", ...args),
  logout: (...args) => DEBUG && console.log("🚪", ...args),
  token: (...args) => DEBUG && console.log("🎟️", ...args),
};

let isRefreshing = false;
let failedQueue = [];

// Function to decode JWT and extract expiry time
const getTokenExpiry = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.exp * 1000;
  } catch (e) {
    log.error("Error decoding token:", e);
    return null;
  }
};

// Function to get token from cookies
const getTokenFromCookies = (name) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

// Function to check if we should attempt refresh
const shouldRefreshToken = () => {
  const accessToken = getTokenFromCookies("accessToken");
  if (!accessToken) return false;

  const expiry = getTokenExpiry(accessToken);
  if (!expiry) return false;

  // If token expires in less than 10 seconds, we should refresh
  const shouldRefresh = expiry - Date.now() < 10000;

  if (shouldRefresh) {
    log.token(
      `Access token expires in ${Math.round((expiry - Date.now()) / 1000)}s, need refresh`
    );
  }

  return shouldRefresh;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (typeof document === "undefined") return;

  // Remove auth cookies before redirecting
  removeAuthCookies();

  const currentPath = window.location.pathname;
  if (currentPath === "/login") return;

  log.logout("Session expired, redirecting to login");
  window.location.href = "/login";
};

// Request interceptor to check token expiry before request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Don't attempt to refresh for auth endpoints to avoid loops
    if (
      config.url.includes("/api/auth") &&
      !config.url.includes("/refresh-token")
    ) {
      return config;
    }

    // Check if token needs refresh before making request
    if (shouldRefreshToken() && !isRefreshing) {
      isRefreshing = true;

      try {
        log.refresh("Preemptively refreshing token before request");
        await axiosInstance.post("/api/auth/refresh-token");
        log.refresh("Preemptive token refresh successful");
        isRefreshing = false;
      } catch (error) {
        log.refresh("Preemptive token refresh failed:", error.message);
        isRefreshing = false;

        if (error.response?.status === 401) {
          log.logout("Refresh token expired during preemptive refresh");
          redirectToLogin();
          return Promise.reject(error);
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract tokens and their expiry from cookies after successful response
    const accessToken = getTokenFromCookies("accessToken");
    if (accessToken) {
      const expiry = getTokenExpiry(accessToken);
      if (expiry) {
        const expiresInSeconds = Math.round((expiry - Date.now()) / 1000);
        log.token(`Access token expires in: ${expiresInSeconds}s`);
      }
    }

    // Handle logout response
    if (response.config.url.includes("/api/auth/logout")) {
      removeAuthCookies();
    }

    return response;
  },
  async (error) => {
    if (!error.response) {
      log.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If the error is 401 and it's not a refresh token request
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      log.token("Access token expired, attempting refresh");

      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        log.refresh("Sending refresh token request");
        const response = await axiosInstance.post("/api/auth/refresh-token");

        if (response.data.status === "success") {
          log.refresh("Token refresh successful");

          // Check new token expiry
          const accessToken = getTokenFromCookies("accessToken");
          if (accessToken) {
            const expiry = getTokenExpiry(accessToken);
            if (expiry) {
              const expiresInSeconds = Math.round((expiry - Date.now()) / 1000);
              log.token(`New access token expires in: ${expiresInSeconds}s`);
            }
          }

          processQueue(null);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          log.refresh("Token refresh failed - invalid response");
          processQueue(new Error("Invalid refresh response"));
          isRefreshing = false;
          redirectToLogin();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        log.refresh("Token refresh failed:", refreshError.message);
        processQueue(refreshError);
        isRefreshing = false;

        if (refreshError.response?.status === 401) {
          log.logout("Refresh token expired");
          redirectToLogin();
        }
        return Promise.reject(refreshError);
      }
    }

    // If it's a refresh token request that failed
    if (
      error.response.status === 401 &&
      originalRequest.url.includes("/refresh-token")
    ) {
      log.logout("Refresh token expired or invalid");
      redirectToLogin();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
