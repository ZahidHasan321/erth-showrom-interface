import { Link, useMatchRoute, useParams } from "@tanstack/react-router";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BRAND_NAMES } from "@/lib/constants";


// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navTop: [
    {
      title: "Homepage",
      url: "/",
    },
  ],
  navMain: [
    {
      title: "Order & Customers",
      url: "",
      items: [
        {
          title: "New Work Order",
          url: "orders/new-work-order",
        },
        {
          title: "New Sales Order",
          url: "orders/new-sales-order",
        },
        {
          title: "Update an Order",
          url: "orders/update-an-order",
        },
        {
          title: "New Alternation Order",
          url: "orders/new-alteration-order",
        },
        {
          title: "Customer Profiles & Orders",
          url: "orders/customer-profiles-orders",
        },
        {
          title: "Orders at Showroom",
          url: "orders/orders-at-showroom",
        }
      ],
    },
    {
      title: "Store Management",
      url: "",
      items: [
        {
          title: "Stock Report",
          url: "store/stock-report",
        },
        {
          title: "Receiving Deliveries",
          url: "store/receiving-deliveries",
        },
        {
          title: "Request Delivery",
          url: "store/request-delivery",
        },
        {
          title: "End of Day Report",
          url: "store/end-of-day-report",
        },
      ],
    },
  ],
}

export function AppSidebar({ brandLogo, brandName, ...props }: React.ComponentProps<typeof Sidebar> & { brandName: string, brandLogo: string }) {

  type SidebarLinkProps = {
    to: string;
    title: string;
    disabled?: boolean;
    exactMatch?: boolean; // New prop
  };

  const SidebarLink: React.FC<SidebarLinkProps> = ({ to, title, disabled = false, exactMatch = false }) => {
    const matchRoute = useMatchRoute();
    const match = exactMatch ? matchRoute({ to }) : matchRoute({ to, fuzzy: true });

    return (
      <SidebarMenuItem>
        <Link to={to} className={""} tabIndex={disabled ? -1 : 0} aria-disabled={disabled} style={disabled ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
          <SidebarMenuButton isActive={!!match} disabled={disabled}>
            {title}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  const { main } = useParams({ strict: false }); // Get the dynamic 'main' parameter
  const mainSegment = main ? `/${main}` : BRAND_NAMES.showroom; // Construct the main segment

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          to="/$main"
          params={{ main: main ?? BRAND_NAMES.showroom }}
          className="flex flex-row items-center gap-3 px-3 py-3"
        >
          <div
            className="text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg"
            style={{ width: "3.5rem", height: "3.5rem" }}
          >
            <img
              src={brandLogo}
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-lg">{brandName}</span>
            {/* ↑ font-bold and larger text */}
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Top-level navigation items. */}
        <SidebarLink key="Homepage" to={mainSegment || "/"} title="Homepage" exactMatch={true} />

        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarLink
                    key={subItem.title}
                    to={`${mainSegment}/${item.url ? `${item.url}/` : ''}${subItem.url}`}
                    title={subItem.title}
                    disabled={false}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}