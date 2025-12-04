const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = (): any | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
  clearAuthToken();
  clearStoredUser();
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
