import { Link, useMatchRoute } from "@tanstack/react-router";
import * as React from "react"

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
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
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
      url: "store",
      items: [
        {
          title: "Stock Report",
          url: "stock-report",
        },
        {
          title: "Receiving Deliveries",
          url: "receiving-deliveries",
        },
        {
          title: "Request Delivery",
          url: "request-delivery",
        },
        {
          title: "End of Day Report",
          url: "end-of-day-report",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  type SidebarLinkProps = {
    to: string;
    title: string;
    disabled?: boolean;
  };

  const SidebarLink: React.FC<SidebarLinkProps> = ({ to, title, disabled = false }) => {
    const matchRoute = useMatchRoute();
    const match = matchRoute({ to, fuzzy: true });

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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <a href="#" className={"flex flex-row items-center gap-2 px-2 py-2"}>
          <div className="text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg" style={{ width: '2.5rem', height: '2.5rem' }}>
            <img src="/Logo-03.svg" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Erth</span>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarLink
                    key={subItem.title}
                    to={`/${item.url ? `${item.url}/` : ''}${subItem.url}`}
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