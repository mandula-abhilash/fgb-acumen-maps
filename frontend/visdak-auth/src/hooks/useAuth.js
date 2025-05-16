"use client";

import { create } from "zustand";

import * as authApi from "../api/auth";
import { removeAuthCookies } from "../utils/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export function useAuth() {
  const { user, loading, setUser, setLoading, setError } = useAuthStore();

  const clearAuthData = () => {
    setUser(null);
    removeAuthCookies();
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);

      if (response?.user) {
        setUser(response.user);
        return { user: response.user };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      clearAuthData();
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await authApi.checkSession();
      const userData = response?.data?.user;

      if (userData) {
        setUser(userData);
      } else {
        clearAuthData();
      }

      return response;
    } catch (error) {
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    checkSession,
  };
}
