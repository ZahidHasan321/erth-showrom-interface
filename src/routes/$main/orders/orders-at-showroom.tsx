import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { RowSelectionState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { GarmentDataTable } from "@/components/orders-at-showroom/garment-data-table";
import { garmentColumns } from "@/components/orders-at-showroom/garment-columns";
import { GarmentTableErrorBoundary } from "@/components/orders-at-showroom/GarmentTableErrorBoundary";
import { useShowroomOrders } from "@/hooks/useShowroomOrders";

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

  // Fetch orders at showroom
  const { data: garments = [], isLoading, isError, error } = useShowroomOrders();

  return (
    <div className="space-y-6 mx-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Orders at Showroom
        </h1>
        <p className="text-sm text-muted-foreground">
          Garments awaiting approval, final pieces, alterations, and cancelled orders
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">
            Loading garments...
          </span>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">
            Failed to load orders at showroom
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <GarmentTableErrorBoundary>
          <GarmentDataTable
            columns={garmentColumns}
            data={garments}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        </GarmentTableErrorBoundary>
      )}
    </div>
  );
}
