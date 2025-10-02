import { AppSidebar } from "@/components/app-sidebar";
import { NotFoundPage } from '@/components/not-found-page';
import { Button } from "@/components/ui/button"; // Added Button
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { BRAND_NAMES } from "@/lib/constants";
import { router } from "@/router";
import { createFileRoute, notFound, Outlet, redirect, rootRouteId } from '@tanstack/react-router'; // Added Link
import ErthLogo from "../../assets/Logo-03.svg"; // Import Erth Logo
import SakhtbaLogo from "../../assets/vite.svg"; // Import Sakhtba Logo

type MainParam = typeof BRAND_NAMES[keyof typeof BRAND_NAMES]

export const Route = createFileRoute('/$main')<{
  params: { main: MainParam }
}>({
  component: RouteComponent,
  // params: {
  //   parse: (params) => {
  //     return { main: params.main as MainParam };
  //   },
  //   stringify: (params) => ({ main: params.main }),
  // },
  loader: async ({ params, context }) => {
    const { auth } = context

      if (params.main !== BRAND_NAMES.showroom && params.main !== BRAND_NAMES.fromHome) {
        throw notFound({routeId: rootRouteId});
      }

    if (auth?.user?.userType !== params.main) {
      throw redirect({
        to: `/${auth?.user?.userType ?? BRAND_NAMES.showroom}`, // fallback to erth if no user
      })
    }
  },
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  notFoundComponent: NotFoundPage,
})


function RouteComponent() {
  const { main } = Route.useParams()

  const auth = useAuth()
  const navigate = Route.useNavigate()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar
        brandLogo={main === BRAND_NAMES.showroom ? ErthLogo : SakhtbaLogo}
        brandName={main === BRAND_NAMES.showroom ? BRAND_NAMES.showroom : BRAND_NAMES.fromHome}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 relative"> {/* Added relative for positioning */}
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2"> {/* Positioned to top right */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 justify-start">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
