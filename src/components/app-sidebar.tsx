import { Link, useMatchRoute, useParams } from "@tanstack/react-router";
import * as React from "react";
import { ChevronDown } from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
        },
        {
          title: "Order Management",
          isCollapsible: true,
          items: [
            {
              title: "Dispatch Orders",
              url: "orders/order-management/dispatch",
            },
            {
              title: "Link Orders",
              url: "orders/order-management/link",
            },
            {
              title: "Unlink Orders",
              url: "orders/order-management/unlink",
            },
            {
              title: "Receiving Brova / Final",
              url: "orders/order-management/receiving-brova-final",
            },
            {
              title: "Change Options",
              url: "orders/order-management/change-options",
            },
            {
              title: "Brova Feedback",
              url: "orders/order-management/brova-feedback",
            },
            {
              title: "Final Feedback",
              url: "orders/order-management/final-feedback",
            },
            {
              title: "Alterations",
              url: "orders/order-management/alterations",
            },
            {
              title: "Cancel Order",
              url: "orders/order-management/cancel-order",
            },
          ],
        },
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
};

export function AppSidebar({
  brandLogo,
  brandName,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  brandName: string;
  brandLogo: string;
}) {
  type SidebarLinkProps = {
    to: string;
    title: string;
    disabled?: boolean;
    exactMatch?: boolean; // New prop
  };

  const SidebarLink: React.FC<SidebarLinkProps> = ({
    to,
    title,
    disabled = false,
    exactMatch = false,
  }) => {
    const matchRoute = useMatchRoute();
    const match = exactMatch
      ? matchRoute({ to })
      : matchRoute({ to, fuzzy: true });

    // Check if the current page is a "new-order" type page:
    const isNewOrderPage =
      typeof window !== "undefined" &&
      /^\/orders\/new-/.test(window.location.pathname);

    return (
      <SidebarMenuItem>
        <Link
          to={to}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          style={disabled ? { pointerEvents: "none", opacity: 0.5 } : {}}
          className={`
            block w-full
            ${
              match
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }
            transition-colors duration-200
          `}
          // When on new-order page, open in a new tab:
          {...(isNewOrderPage
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <SidebarMenuButton
            isActive={!!match}
            disabled={disabled}
            className={`
              w-full justify-start
              ${
                match
                  ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                  : "hover:bg-accent/50 hover:text-foreground"
              }
              transition-all duration-200
            `}
          >
            {title}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  type CollapsibleMenuItemProps = {
    title: string;
    items: Array<{ title: string; url: string }>;
    mainSegment: string;
  };

  const CollapsibleMenuItem: React.FC<CollapsibleMenuItemProps> = ({
    title,
    items,
    mainSegment,
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const matchRoute = useMatchRoute();

    // Check if any sub-item is active
    const hasActiveChild = items.some((item) =>
      matchRoute({ to: `${mainSegment}/${item.url}`, fuzzy: true })
    );

    // Auto-expand if a child is active
    React.useEffect(() => {
      if (hasActiveChild) {
        setIsOpen(true);
      }
    }, [hasActiveChild]);

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full justify-between
            ${
              hasActiveChild
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-accent/50 hover:text-foreground"
            }
            transition-all duration-200
          `}
        >
          <span>{title}</span>
          <ChevronDown
            className={`ml-auto h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub className="ml-4 mt-1 space-y-1">
            {items.map((subItem) => {
              const match = matchRoute({
                to: `${mainSegment}/${subItem.url}`,
                fuzzy: true,
              });
              const isNewOrderPage =
                typeof window !== "undefined" &&
                /^\/orders\/new-/.test(window.location.pathname);

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <Link
                    to={`${mainSegment}/${subItem.url}`}
                    className={`
                      block w-full
                      ${
                        match
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }
                      transition-colors duration-200
                    `}
                    {...(isNewOrderPage
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <SidebarMenuSubButton
                      isActive={!!match}
                      className={`
                        w-full justify-start
                        ${
                          match
                            ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                            : "hover:bg-accent/50 hover:text-foreground"
                        }
                        transition-all duration-200
                      `}
                    >
                      {subItem.title}
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  const { main } = useParams({ strict: false }); // Get the dynamic 'main' parameter
  const mainSegment = main ? `/${main}` : BRAND_NAMES.showroom; // Construct the main segment

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-border/60">
        <Link
          to="/$main"
          params={{ main: main ?? BRAND_NAMES.showroom }}
          className="flex flex-row items-center gap-3 px-4 py-4 transition-all duration-200 hover:bg-accent/30 rounded-lg mx-2"
        >
          <div
            className="flex aspect-square items-center justify-center rounded-lg bg-primary/10 p-2"
            style={{ width: "3.5rem", height: "3.5rem" }}
          >
            <img
              src={brandLogo}
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-xl text-foreground">
              {brandName}
            </span>
            <span className="text-xs text-muted-foreground">Clothing</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        {/* Top-level navigation items. */}
        <SidebarGroup key="top" className="mb-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink
                key="Homepage"
                to={mainSegment || "/"}
                title="Homepage"
                exactMatch={true}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {item.items.map((subItem: any) => {
                  // Check if this is a collapsible item
                  if (subItem.isCollapsible && subItem.items) {
                    return (
                      <CollapsibleMenuItem
                        key={subItem.title}
                        title={subItem.title}
                        items={subItem.items}
                        mainSegment={mainSegment}
                      />
                    );
                  }

                  // Regular menu item
                  return (
                    <SidebarLink
                      key={subItem.title}
                      to={`${mainSegment}/${item.url ? `${item.url}/` : ""}${subItem.url}`}
                      title={subItem.title}
                      disabled={false}
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

