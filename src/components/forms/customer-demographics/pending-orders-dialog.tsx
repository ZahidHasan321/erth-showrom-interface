"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { Calendar, Package } from "lucide-react";
import { ErrorBoundary } from "@/components/global/error-boundary";

interface PendingOrdersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onCreateNewOrder: () => void;
  customerName?: string;
}

export function PendingOrdersDialog({
  isOpen,
  onOpenChange,
  orders,
  onSelectOrder,
  onCreateNewOrder,
  customerName,
}: PendingOrdersDialogProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleSelect = (order: Order) => {
    onSelectOrder(order);
    onOpenChange(false);
  };

  const handleCreateNew = () => {
    onCreateNewOrder();
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % orders.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + orders.length) % orders.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(orders[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, orders, selectedIndex]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <ErrorBoundary
          fallback={
            <div className="p-4 text-destructive">
              Failed to load pending orders dialog
            </div>
          }
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Pending Orders Found
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {customerName ? `${customerName} has ` : "This customer has "}
              {orders.length} pending {orders.length === 1 ? "order" : "orders"}
              . Would you like to continue an existing order or create a new
              one?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-4">
            {orders.map((order, index) => (
              <div
                key={order.id}
                onClick={() => handleSelect(order)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedIndex === index
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-accent/10"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg text-foreground">
                      Order #{order.fields.OrderID}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.fields.OrderDate)}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  {order.fields.NumOfFabrics !== undefined && (
                    <div>
                      <span className="font-medium text-foreground">
                        Fabrics:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {order.fields.NumOfFabrics}
                      </span>
                    </div>
                  )}
                  {order.fields.Advance !== undefined && (
                    <div>
                      <span className="font-medium text-foreground">
                        Advance:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {order.fields.Advance} KWD
                      </span>
                    </div>
                  )}
                  {order.fields.PaymentType && (
                    <div>
                      <span className="font-medium text-foreground">
                        Payment:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {order.fields.PaymentType}
                      </span>
                    </div>
                  )}
                  {order.fields.HomeDelivery !== undefined && (
                    <div>
                      <span className="font-medium text-foreground">
                        Delivery:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {order.fields.HomeDelivery ? "Home" : "Pickup"}
                      </span>
                    </div>
                  )}
                </div>

                {order.fields.Notes && (
                  <div className="mt-2 pt-2 border-t border-border/60">
                    <span className="text-xs font-medium text-foreground">
                      Notes:
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {order.fields.Notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNew}>Create New Order</Button>
          </DialogFooter>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
