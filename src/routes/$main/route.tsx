import { AppSidebar } from "@/components/app-sidebar"
import { NotFoundPage } from '@/components/not-found-page'
import { Button } from "@/components/ui/button"; // Added Button
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar"
import ErthLogo from "../../assets/Logo-03.svg"; // Import Erth Logo
import SakhtbaLogo from "../../assets/vite.svg"; // Import Sakhtba Logo
import { createFileRoute, Link, notFound, Outlet } from '@tanstack/react-router'; // Added Link

const validRoutes = ['erth', 'sakhtba']
export const Route = createFileRoute('/$main')({
  component: RouteComponent,
  loader: async ({ params }) => {
    if (!validRoutes.includes(params.main)) {
      throw notFound();
    }
  },
  notFoundComponent: NotFoundPage
})


function RouteComponent() {
  const { main } = Route.useParams()

  return (
    <SidebarProvider>
      <AppSidebar
        brandLogo={main === "erth" ? ErthLogo : SakhtbaLogo}
        brandName={main === "erth" ? "Erth" : "Sakhtba"}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 relative"> {/* Added relative for positioning */}
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2"> {/* Positioned to top right */}
            <Link to="/">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6 justify-start">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
