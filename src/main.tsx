import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist/index.css";
import "./index.css";
import App from "./App";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NuqsAdapter fullPageNavigationOnShallowFalseUpdates>
      <App />
    </NuqsAdapter>
    <Toaster />
  </StrictMode>,
);
