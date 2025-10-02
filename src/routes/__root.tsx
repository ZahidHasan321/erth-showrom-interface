// src/routes/__root.tsx
import { ErrorBoundary } from "@/components/global/error-boundary";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import { NotFoundPage } from "@/components/not-found-page";
import type { AuthContext } from "@/context/auth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

interface MyRouterContext {
  auth: AuthContext
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  pendingComponent: LoadingSpinner,
});


function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </ErrorBoundary>
  );
}
