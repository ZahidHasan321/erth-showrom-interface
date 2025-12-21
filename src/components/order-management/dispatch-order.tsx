"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// API and Types
import { searchOrders, updateOrder } from "@/api/orders";
import type { Order } from "@/types/order";
import type { ApiResponse } from "@/types/api";
import { FatouraStage } from "@/types/stages";

interface OrderCardProps {
  order: Order;
  onDispatch: (orderId: string) => Promise<void>;
  isUpdating: boolean;
}

function OrderCard({ order, onDispatch, isUpdating }: OrderCardProps) {
  const numFabrics = order.fields.NumOfFabrics ?? 0;
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    Array.from({ length: numFabrics }, () => false),
  );

  const allChecked = numFabrics === 0 || checkedStates.every(Boolean);
  const orderId = order.fields.OrderID ?? "N/A";
  const fatoura = order.fields.Fatoura ?? "N/A";

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setCheckedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = checked;
      return newStates;
    });
  };

  const handleDispatch = async () => {
    if (allChecked && !isUpdating) {
      await onDispatch(order.id);
      // Reset checkboxes after successful dispatch
      setCheckedStates(Array.from({ length: numFabrics }, () => false));
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              Order #{orderId}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Fatoura: <span className="font-medium">{fatoura}</span>
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {order.fields.FatouraStages}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Piece Check ({numFabrics} {numFabrics === 1 ? "piece" : "pieces"})
          </p>
          {numFabrics > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: numFabrics }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
                >
                  <Checkbox
                    id={`${order.id}-piece-${index}`}
                    checked={checkedStates[index]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(index, checked as boolean)
                    }
                    disabled={isUpdating}
                  />
                  <label
                    htmlFor={`${order.id}-piece-${index}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    Piece {index + 1}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No pieces to check (0 fabrics)
            </p>
          )}
        </div>
        <Button
          className="justify-end"
          onClick={handleDispatch}
          disabled={!allChecked || isUpdating}
          variant={allChecked ? "default" : "secondary"}
        >
          {isUpdating ? "Dispatching..." : "Dispatch"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DispatchOrderPage() {
  const queryClient = useQueryClient();
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<Order[]>>({
    queryKey: ["dispatchOrders"],
    queryFn: async () => {
      const response = await searchOrders({
        FatouraStages: FatouraStage.FATOURA_RECEIVED as string,
        OrderStatus: "Completed",
      });
      return response;
    },
  });

  const orders = ordersResponse?.data || [];

  const handleDispatch = async (orderId: string) => {
    setUpdatingOrderIds((prev) => new Set(prev).add(orderId));
    try {
      await updateOrder(
        { FatouraStages: FatouraStage.SENT_TO_PRODUCTION },
        orderId,
      );
      toast.success(`Order dispatched successfully!`);
      // Refresh the list
      await queryClient.invalidateQueries({ queryKey: ["dispatchOrders"] });
    } catch (error) {
      console.error("Failed to dispatch order:", error);
      toast.error("Failed to dispatch order. Please try again.");
    } finally {
      setUpdatingOrderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm mt-1">{error?.message}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dispatch Orders</h1>
          <p className="text-muted-foreground mt-1">
            Ready to send {orders.length} order{orders.length !== 1 ? "s" : ""}{" "}
            to production
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["dispatchOrders"] })
          }
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-2">
                    All caught up!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No orders with "Fatoura Received" and "Completed" status
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onDispatch={handleDispatch}
              isUpdating={updatingOrderIds.has(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
