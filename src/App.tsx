import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicOnly, RequireAuth } from "./routes/RouteGuards";
import { useAuthStore } from "./store/authStore";

const HomePage = lazy(() => import("./pages/HomePage"));
const GeneratorPage = lazy(() => import("./pages/GeneratorPage"));
const PresentationPage = lazy(() => import("./pages/PresentationPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

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
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route
          path="/presentation/:presentationId"
          element={<PresentationPage />}
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
            Chargement...
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
