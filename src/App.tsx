import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GeneratorPage from "./pages/GeneratorPage";
import PresentationPage from "./pages/PresentationPage";
import AuthPage from "./pages/AuthPage";
import { PublicOnly, RequireAuth } from "./routes/RouteGuards";
import { useAuthStore } from "./store/authStore";

function AppRoutes() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicOnly />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/generate" element={<GeneratorPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
