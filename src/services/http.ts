import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8000/api/v1";

const AUTH_TOKEN_KEY = "mytopic_auth_token";

export const apiClient = axios.create({
  baseURL: API_BASE,
});

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
