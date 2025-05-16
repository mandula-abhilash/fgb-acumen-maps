export const removeAuthCookies = () => {
  if (typeof document === "undefined") return;

  const cookies = ["accessToken", "refreshToken"];

  // Simply remove cookies without trying different domains
  cookies.forEach((cookie) => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  });
};
