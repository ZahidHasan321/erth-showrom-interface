// src/routes/__root.tsx
import { ErrorBoundary } from "@/components/global/error-boundary";
import { GlobalLoader } from "@/components/global/global-loader";
import { NotFoundPage } from "@/components/not-found-page";
import type { AuthContext } from "@/context/auth";
import { LoaderProvider } from "@/context/loader";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <ErrorBoundary>
      <LoaderProvider>
        <GlobalLoader />
        <Outlet />
        <Toaster position="top-center" richColors closeButton />
      </LoaderProvider>
    </ErrorBoundary>
  );
}
