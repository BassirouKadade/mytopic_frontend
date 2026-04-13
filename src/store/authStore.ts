import axios from "axios";
import { create } from "zustand";

import {
  fetchMe,
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
  type AuthUser,
} from "@/services/auth";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "@/services/http";

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  bootstrapped: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (payload: Credentials) => Promise<void>;
  signUp: (payload: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
}

function readAxiosError(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }
  const detail = error.response?.data?.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }
  return error.message || fallback;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,
  bootstrapped: false,
  error: null,

  initialize: async () => {
    const token = getStoredToken();
    if (!token) {
      set({ bootstrapped: true, user: null, token: null, error: null });
      return;
    }

    set({ loading: true, error: null, token });
    try {
      const data = await fetchMe();
      set({ user: data.user, token, loading: false, bootstrapped: true });
    } catch {
      clearStoredToken();
      set({ user: null, token: null, loading: false, bootstrapped: true });
    }
  },

  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await signInRequest(email, password);
      if (!data.token) {
        throw new Error("Reponse d'authentification invalide.");
      }
      setStoredToken(data.token);
      set({
        token: data.token,
        user: data.user,
        loading: false,
        error: null,
        bootstrapped: true,
      });
    } catch (error) {
      set({
        loading: false,
        error: readAxiosError(error, "Connexion impossible."),
        user: null,
        token: null,
      });
      throw error;
    }
  },

  signUp: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await signUpRequest(email, password);
      if (!data.token) {
        throw new Error("Reponse d'inscription invalide.");
      }
      setStoredToken(data.token);
      set({
        token: data.token,
        user: data.user,
        loading: false,
        error: null,
        bootstrapped: true,
      });
    } catch (error) {
      set({
        loading: false,
        error: readAxiosError(error, "Inscription impossible."),
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOutRequest();
    } catch {
      // Ignore network errors on sign out; local token clear is source of truth.
    } finally {
      clearStoredToken();
      set({
        user: null,
        token: null,
        error: null,
        loading: false,
        bootstrapped: true,
      });
    }
  },
}));
