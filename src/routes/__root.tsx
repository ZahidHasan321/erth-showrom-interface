// src/routes/__root.tsx
import {createRootRoute, Outlet} from "@tanstack/react-router";
import {AppSidebar} from "@/components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <main className="flex-1 p-6 justify-start">
          <Outlet/>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
