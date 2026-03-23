export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return document.cookie.includes("accessToken");
};

export const getUserName = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userName");
};

export const triggerAuthUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-change"));
  }
};

export const logout = () => {
  if (typeof window !== "undefined") {
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    localStorage.removeItem("userName");
    triggerAuthUpdate();
    window.location.href = "/";
  }
};
