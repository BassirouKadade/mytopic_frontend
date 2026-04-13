import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";

function FullscreenLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="rounded-2xl border border-border/60 bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm inline-flex items-center gap-2">
        <Spinner className="size-4" />
        Verification de la session...
      </div>
    </div>
  );
}

export function RequireAuth() {
  const location = useLocation();
  const { token, bootstrapped } = useAuthStore();

  if (!bootstrapped) {
    return <FullscreenLoader />;
  }

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicOnly() {
  const { token, bootstrapped } = useAuthStore();

  if (!bootstrapped) {
    return <FullscreenLoader />;
  }

  if (token) {
    return <Navigate to="/generate" replace />;
  }

  return <Outlet />;
}
