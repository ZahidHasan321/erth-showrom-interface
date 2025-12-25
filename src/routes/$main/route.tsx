import { AppSidebar } from "@/components/app-sidebar";
import { NotFoundPage } from '@/components/not-found-page';
import { Button } from "@/components/ui/button";
import { LogOut, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth";
import { BRAND_NAMES } from "@/lib/constants";
import { router } from "@/router";
import { createFileRoute, notFound, Outlet, redirect, rootRouteId, Link } from '@tanstack/react-router';
import ErthLogo from "../../assets/erth-light.svg";
import SakhtbaLogo from "../../assets/Sakkba.png";
import { useEffect } from "react";

type MainParam = typeof BRAND_NAMES[keyof typeof BRAND_NAMES]

export const Route = createFileRoute('/$main')<{
  params: { main: MainParam }
}>({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { auth } = context

    if (params.main !== BRAND_NAMES.showroom && params.main !== BRAND_NAMES.fromHome) {
      throw notFound({ routeId: rootRouteId });
    }

    // Return whether there's a brand mismatch
    return {
      hasBrandMismatch: auth?.user?.userType !== params.main,
      userBrand: auth?.user?.userType,
      attemptedBrand: params.main,
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
  head: ({ params }) => ({
    meta: [{
      title: params.main,
    }
    ],
    links: [{
      rel: 'icon',
      type: "image/svg+xml",
      href: params.main === 'erth' ? "/erth.svg" : "/Sakkba.png"
    }]
  }),
})


function RouteComponent() {
  const { main } = Route.useParams()
  const loaderData = Route.useLoaderData()

  const auth = useAuth()
  const navigate = Route.useNavigate()

  // Apply brand-specific theme
  useEffect(() => {
    const root = document.documentElement
    // Remove both theme classes first
    root.classList.remove('erth', 'sakkba')
    // Add the current brand theme
    root.classList.add(main)

    return () => {
      // Cleanup: remove theme class when unmounting
      root.classList.remove(main)
    }
  }, [main])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
    }
  }

  const attemptedBrandName = loaderData.attemptedBrand === BRAND_NAMES.showroom ? 'Erth' : 'Sakkba'
  const userBrandName = loaderData.userBrand === BRAND_NAMES.showroom ? 'Erth' : 'Sakkba'

  // Show error page if user tried to access wrong brand
  const errorPage = (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-destructive/5 to-background p-8">
      <div className="max-w-2xl w-full bg-card border-2 border-destructive/20 rounded-2xl shadow-2xl p-12 text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-6 rounded-full">
            <ShieldAlert className="w-24 h-24 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground">
          Access Denied
        </h1>

        <p className="text-lg text-muted-foreground">
          You don't have permission to access <span className="font-semibold text-foreground">{attemptedBrandName}</span>.
        </p>

        <p className="text-base text-muted-foreground">
          You are currently logged in as a <span className="font-semibold text-foreground">{userBrandName}</span> user.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/${loaderData.userBrand}`}>
            <Button size="lg" className="w-full sm:w-auto">
              Go to {userBrandName}
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  const mainLayout = (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar
          brandLogo={main === BRAND_NAMES.showroom ? ErthLogo : SakhtbaLogo}
          brandName={main === BRAND_NAMES.showroom ? BRAND_NAMES.showroom : BRAND_NAMES.fromHome}
        />
        <SidebarInset  className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 relative">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )

  return loaderData.hasBrandMismatch ? errorPage : mainLayout
}
