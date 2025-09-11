// src/components/Sidebar.tsx
import { Link } from "@tanstack/react-router";

export function Sidebar() {
  const base =
    "block py-2 px-4 text-sm text-gray-900 hover:underline transition-colors";
  const active = "font-semibold underline";

  return (
    <nav className=" bg-white min-h-full text-sm">
      <ul className="mb-8">
        <li>
          <Link to="/" className={base} activeProps={{ className: active }}>
            Home Page
          </Link>
        </li>
      </ul>

      <div className="bg-gray-200 p-8 pb-30">
        <div className="mb-8">
          <h2 className="mb-2 font-bold">Orders & Customers</h2>
          <ul className="space-y-1">
            <li>
              <Link
                to="/orders/new-work-order"
                className={base}
                activeProps={{ className: active }}
              >
                New Work Order
              </Link>
            </li>
            <li>
              <Link
                to="/orders/new-sales-order"
                className={base}
                activeProps={{ className: active }}
              >
                New Sales Order
              </Link>
            </li>
            <li>
              <Link
                to="/orders/update-an-order"
                className={base}
                activeProps={{ className: active }}
              >
                Update an Order
              </Link>
            </li>
            <li>
              <Link
                to="/orders/new-alteration-order"
                className={base}
                activeProps={{ className: active }}
              >
                New Alteration Order
              </Link>
            </li>
            <li>
              <Link
                to="/orders/customer-profiles-orders"
                className={base}
                activeProps={{ className: active }}
              >
                Customer Profiles & Orders
              </Link>
            </li>
            <li>
              <Link
                to="/orders/orders-at-showroom"
                className={base}
                activeProps={{ className: active }}
              >
                Orders at Showroom
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 font-bold">Store Management</h2>
          <ul className="space-y-1">
            <li>
              <Link
                to="/store/stock-report"
                className={base}
                activeProps={{ className: active }}
              >
                Stock Report
              </Link>
            </li>
            <li>
              <Link
                to="/store/receiving-deliveries"
                className={base}
                activeProps={{ className: active }}
              >
                Receiving Deliveries
              </Link>
            </li>
            <li>
              <Link
                to="/store/request-delivery"
                className={base}
                activeProps={{ className: active }}
              >
                Request Delivery
              </Link>
            </li>
            <li>
              <Link
                to="/store/end-of-day-report"
                className={base}
                activeProps={{ className: active }}
              >
                End of Day Report (CLOSE the SHOP)
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
