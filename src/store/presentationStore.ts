import { create } from "zustand";
import axios from "axios";
import type { Presentation } from "../services/api";
import { generatePresentation } from "../services/api";

interface PresentationState {
  presentation: Presentation | null;
  loading: boolean;
  error: string | null;
  generate: (topic: string, language?: string) => Promise<void>;
  reset: () => void;
}

export const usePresentationStore = create<PresentationState>((set) => ({
  presentation: null,
  loading: false,
  error: null,

  generate: async (topic: string, language?: string) => {
    set({ loading: true, error: null, presentation: null });
    try {
      const data = await generatePresentation(topic, language);
      set({ presentation: data, loading: false });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.detail as string | undefined) ||
          err.message ||
          "La generation a echoue."
        : err instanceof Error
          ? err.message
          : "La generation a echoue.";
      set({ error: message, loading: false });
    }
  },

  reset: () => set({ presentation: null, loading: false, error: null }),
}));
