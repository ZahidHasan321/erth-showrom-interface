// src/routes/__root.tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/global/sidebar";
import { Header } from "../components/global/header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen  text-gray-900">
      <Header />
      <div className="flex flex-1">
        <aside className="w-72 shrink-0 bg-gray-200">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 justify-start">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
