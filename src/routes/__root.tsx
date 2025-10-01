// src/routes/__root.tsx
import { NotFoundPage } from "@/components/not-found-page";
import type { AuthContext } from "@/context/auth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

interface MyRouterContext {
  auth: AuthContext
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});


function RootLayout() {
  return (
    <div>
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
