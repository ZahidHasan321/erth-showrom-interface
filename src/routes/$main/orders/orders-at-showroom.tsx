import { useState } from "react";

import { OrdersDataTable } from "@/components/orders-at-showroom/data-table";
import { ordersAtShowroomColumns } from "@/components/orders-at-showroom/columns";
import { ordersData } from "@/components/orders-at-showroom/data";
import type { RowSelectionState } from "@tanstack/react-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$main/orders/orders-at-showroom")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Orders at Showroom",
      },
    ],
  }),
});

function RouteComponent() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Orders at Showroom
        </h1>
      </div>
      <OrdersDataTable
        columns={ordersAtShowroomColumns}
        data={ordersData}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  );
}
