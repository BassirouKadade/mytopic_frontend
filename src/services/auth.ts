import { apiClient } from "@/services/http";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_admin: boolean;
}

export interface AuthResponse {
  token?: string;
  user: AuthUser;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/users/auth/sign-in", {
    email,
    password,
  });
  return data;
}

export async function signUp(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/users/auth/sign-up", {
    email,
    password,
  });
  return data;
}

export async function fetchMe(): Promise<AuthResponse> {
  const { data } = await apiClient.get<AuthResponse>("/users/auth/me");
  return data;
}

export async function signOut(): Promise<void> {
  await apiClient.post("/users/auth/sign-out");
}
