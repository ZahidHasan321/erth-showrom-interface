// src/routes/__root.tsx
import { NotFoundPage } from "@/components/not-found-page";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage
});


function RootLayout() {
  return (
    <div className="flex-1 p-6 justify-start">
      <Outlet />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
