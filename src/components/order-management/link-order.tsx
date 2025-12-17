import {
  searchOrders,
  getPendingOrdersByCustomer,
  updateOrder,
} from "@/api/orders";
import { searchCustomerByPhone, getCustomerByRecordId } from "@/api/customers";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

// UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";
import type { ApiResponse } from "@/types/api";

type SelectedOrder = {
  id: string;
  orderId?: string;
  orderDate?: string;
  reviseDate?: string;
  fatoura?: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
};

export default function LinkOrder() {
  // --- Search Inputs ---
  const [orderId, setOrderId] = useState<number | undefined>();
  const [fatoura, setFatoura] = useState<number | undefined>();
  const [customerMobile, setCustomerMobile] = useState<number | undefined>();

  // --- Global State ---
  const [reviseDate, setReviseDate] = useState<Date | undefined>();
  const [selectedOrders, setSelectedOrders] = useState<SelectedOrder[]>([]);
  const [primaryOrderId, setPrimaryOrderId] = useState<string | null>(null);

  // --- Customer Info Map ---
  const [customerInfoMap, setCustomerInfoMap] = useState<
    Record<string, Customer | undefined>
  >({});

  // --- Dialog State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [selectedDialogIds, setSelectedDialogIds] = useState<string[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomerInfo, setIsLoadingCustomerInfo] = useState(false);

  // --- Single Order Search Query ---
  const { refetch: searchSingleOrder, isFetching: isSearchingSingle } =
    useQuery<ApiResponse<Order[]>>({
      queryKey: ["searchOrder", orderId, fatoura],
      queryFn: () => {
        if (orderId)
          return searchOrders({
            orderId: orderId.toString(),
            orderStatus: "Completed",
          });
        if (fatoura)
          return searchOrders({
            fatoura: fatoura.toString(),
            orderStatus: "Completed",
          });
        throw new Error("Missing search parameter");
      },
      enabled: false,
    });

  // --- Main Form Submit ---
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (customerMobile) {
      setIsSearchingCustomer(true);
      try {
        const customerResponse = await searchCustomerByPhone(
          customerMobile.toString(),
        );

        if (!customerResponse.data || customerResponse.data.length === 0) {
          toast.error("Customer not found with this phone number.");
          return;
        }

        const customerId = customerResponse.data[0].fields.id;
        if (!customerId) {
          toast.error("Customer ID is missing in the record.");
          return;
        }

        const ordersResponse = await getPendingOrdersByCustomer(
          customerId,
          5,
          "Completed",
        );

        if (ordersResponse.data && ordersResponse.data.length > 0) {
          setCustomerOrders(ordersResponse.data);
          setSelectedDialogIds([]);
          setIsDialogOpen(true);
        } else {
          toast.info("No completed orders found for this customer.");
        }
      } catch (error) {
        console.error("Failed to fetch customer orders", error);
        toast.error("Failed to fetch customer orders.");
      } finally {
        setIsSearchingCustomer(false);
      }
      return;
    }

    if (orderId || fatoura) {
      searchSingleOrder().then(({ data }) => {
        if (!data || !data.data || data.data.length === 0) {
          toast.error("No order found with the provided criteria.");
          return;
        }
        addOrdersToSelection([data.data[0]]);
      });
    }
  }

  // --- Helper: Add Orders to Main List ---
  function addOrdersToSelection(orders: Order[]) {
    // Filter out already linked orders
    const nonLinkedOrders = orders.filter((order) => !order.fields.LinkedOrder);

    // Show warning if some orders were skipped
    if (nonLinkedOrders.length < orders.length) {
      const skippedCount = orders.length - nonLinkedOrders.length;
      toast.warning(
        `${skippedCount} order(s) were already linked and skipped.`,
      );
    }

    if (nonLinkedOrders.length === 0) {
      return;
    }

    setSelectedOrders((prev) => {
      const newOrders = nonLinkedOrders
        .filter((order) => !prev.some((p) => p.id === order.id))
        .map((order) => ({
          id: order.id,
          orderId: order.fields.OrderID,
          deliveryDate: order.fields.DeliveryDate,
          reviseDate: reviseDate ? reviseDate.toISOString() : undefined,
          fatoura: order.fields.Fatoura,
          customerId: order.fields.CustomerID?.[0],
        }));
      return [...prev, ...newOrders];
    });

    // Fetch customer info for new orders
    nonLinkedOrders.forEach((order) => {
      if (order.fields.CustomerID?.[0]) {
        fetchCustomerInfo(order.fields.CustomerID[0], order.id);
      }
    });
  }

  // --- Helper: Remove Order ---
  function removeOrder(id: string) {
    setSelectedOrders((prev) => prev.filter((o) => o.id !== id));
    if (primaryOrderId === id) {
      setPrimaryOrderId(null);
    }
    // Clean up customer info
    setCustomerInfoMap((prev) => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
  }

  // --- Fetch Customer Info ---
  async function fetchCustomerInfo(customerId: string, orderId: string) {
    setIsLoadingCustomerInfo(true);
    try {
      const response = await getCustomerByRecordId(customerId);
      if (response.data) {
        setCustomerInfoMap((prev) => ({
          ...prev,
          [orderId]: response.data,
        }));
      } else {
        // Optionally handle missing data
        setCustomerInfoMap((prev) => ({ ...prev }));
      }
    } catch (error) {
      console.error(
        `Failed to fetch customer info for order ${orderId}`,
        error,
      );
    } finally {
      setIsLoadingCustomerInfo(false);
    }
  }

  // --- Dialog Handlers ---
  function toggleDialogSelection(id: string) {
    setSelectedDialogIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function handleDialogConfirm() {
    const ordersToAdd = customerOrders.filter((o) =>
      selectedDialogIds.includes(o.id),
    );
    addOrdersToSelection(ordersToAdd);
    setIsDialogOpen(false);
  }

  // --- Revise Date Effect ---
  useEffect(() => {
    if (selectedOrders.length > 0 && reviseDate) {
      setSelectedOrders((prev) =>
        prev.map((order) => ({
          ...order,
          reviseDate: reviseDate.toISOString(),
        })),
      );
    }
  }, [reviseDate]);

  // --- Link Orders Handler ---
  async function handleLinkOrders() {
    if (!reviseDate) {
      toast.error("Please select a revise date.");
      return;
    }

    if (!primaryOrderId) {
      toast.error("Please select a primary order.");
      return;
    }

    if (selectedOrders.length < 2) {
      toast.error("Please select at least 2 orders to link.");
      return;
    }

    // Verify all orders are still valid (not already linked)
    const alreadyLinked = selectedOrders.filter((order) => {
      const originalOrder = customerOrders.find((o) => o.id === order.id);
      return originalOrder?.fields.LinkedOrder;
    });

    if (alreadyLinked.length > 0) {
      toast.error(
        `${alreadyLinked.length} order(s) are already linked. Please refresh and try again.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare all update promises
      const updatePromises = selectedOrders.map((order) => {
        const isPrimary = order.id === primaryOrderId;

        // Base update for delivery date
        const updateData: Partial<Order["fields"]> = {
          DeliveryDate: reviseDate.toISOString(),
        };

        // For linked orders, add linking fields
        if (!isPrimary) {
          updateData.LinkedOrder = true;
          updateData.LinkedDate = new Date().toISOString();
          updateData.LinkedTo = [primaryOrderId];
        }

        return updateOrder(updateData, order.id);
      });

      // Execute all updates
      await Promise.all(updatePromises);

      toast.success(`Successfully linked ${selectedOrders.length} orders.`);

      // Reset form
      handleClear();
    } catch (error) {
      console.error("Failed to link orders", error);
      toast.error("Failed to link orders. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- Clear Form ---
  function handleClear() {
    setSelectedOrders([]);
    setPrimaryOrderId(null);
    setReviseDate(undefined);
    setCustomerInfoMap({});
    setOrderId(undefined);
    setFatoura(undefined);
    setCustomerMobile(undefined);
    setCustomerOrders([]);
    setSelectedDialogIds([]);
  }

  const isFetching =
    isSearchingSingle || isSearchingCustomer || isLoadingCustomerInfo;
  const hasOrders = selectedOrders.length > 0;
  const canSubmit =
    hasOrders && !!reviseDate && !!primaryOrderId && !isSubmitting;

  return (
    <section className="space-y-6 p-10">
      <h1 className="text-xl font-semibold">Link Orders</h1>

      {/* --- Search Form --- */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Order ID"
            value={orderId ?? ""}
            disabled={!!fatoura || !!customerMobile}
            onChange={(e) => setOrderId(e.target.valueAsNumber || undefined)}
            className="w-32"
          />
          <Input
            type="number"
            placeholder="Fatoura"
            value={fatoura ?? ""}
            disabled={!!orderId || !!customerMobile}
            onChange={(e) => setFatoura(e.target.valueAsNumber || undefined)}
            className="w-32"
          />
          <Input
            type="number"
            placeholder="Cust. Mobile"
            value={customerMobile ?? ""}
            disabled={!!orderId || !!fatoura}
            onChange={(e) =>
              setCustomerMobile(e.target.valueAsNumber || undefined)
            }
            className="w-40"
          />
        </div>
        <Button
          type="submit"
          disabled={isFetching || (!orderId && !fatoura && !customerMobile)}
        >
          {isFetching ? "Searching..." : "Search & Add"}
        </Button>
      </form>

      {/* --- Revise Date Picker --- */}
      <div
        className={cn(
          "flex items-center gap-2 p-4 rounded-lg border border-dashed transition-colors",
          hasOrders
            ? "bg-muted/20 border-muted-foreground/30"
            : "bg-muted/5 border-muted/20 opacity-60",
        )}
      >
        <label className="text-sm font-medium whitespace-nowrap">
          Set Revise Date:
        </label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              disabled={!hasOrders}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !reviseDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {reviseDate ? (
                format(reviseDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={reviseDate}
              onSelect={setReviseDate}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground ml-2 hidden md:inline">
          (Applies to all selected orders)
        </span>
      </div>

      {/* --- Orders Table --- */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left w-10">Primary</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Fatoura</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Delivery Date</th>
              <th className="p-3 text-left">Revise Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {!hasOrders ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-muted-foreground"
                >
                  No orders selected. Search to add orders.
                </td>
              </tr>
            ) : (
              selectedOrders.map((order) => {
                const isPrimary = order.id === primaryOrderId;
                // const customerInfo = customerInfoMap[order.id];

                return (
                  <tr
                    key={order.id}
                    className={cn(
                      "border-t hover:bg-muted/10 transition-colors",
                      isPrimary && "bg-blue-50/50 border-blue-200",
                    )}
                  >
                    <td className="p-3">
                      <input
                        type="radio"
                        name="primaryOrder"
                        checked={isPrimary}
                        onChange={() => setPrimaryOrderId(order.id)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="p-3 font-medium">{order.orderId ?? "-"}</td>
                    <td className="p-3">{order.fatoura ?? "-"}</td>
                    <td className="p-3">
                      {order.customerId ? (
                        customerInfoMap[order.id] ? (
                          <div>
                            <div className="font-medium text-sm">
                              {customerInfoMap[order.id]?.fields.Name ?? "-"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {customerInfoMap[order.id]?.fields.Phone ?? "-"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Loading...
                          </span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 text-blue-600 font-medium">
                      {order.reviseDate ? (
                        format(new Date(order.reviseDate), "PPP")
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Not set
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOrder(order.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* --- Final Submit Button --- */}
      <div className="flex justify-end pt-2">
        <Button onClick={handleLinkOrders} size="lg" disabled={!canSubmit}>
          {isSubmitting ? "Linking Orders..." : "Link Orders"}
        </Button>
      </div>

      {/* --- Customer Selection Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Customer Orders</DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  <th className="p-2 w-10 bg-muted">
                    <Checkbox
                      checked={
                        customerOrders.length > 0 &&
                        selectedDialogIds.length === customerOrders.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked)
                          setSelectedDialogIds(customerOrders.map((o) => o.id));
                        else setSelectedDialogIds([]);
                      }}
                    />
                  </th>
                  <th className="p-2 text-left bg-muted">Order ID</th>
                  <th className="p-2 text-left bg-muted">Fatoura</th>
                  <th className="p-2 text-left bg-muted">Date</th>
                  <th className="p-2 text-left bg-muted">Status</th>
                  <th className="p-2 text-left bg-muted">Linked</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedDialogIds.includes(order.id)}
                        onCheckedChange={() => toggleDialogSelection(order.id)}
                        disabled={order.fields.LinkedOrder}
                      />
                    </td>
                    <td className="p-2">{order.fields.OrderID}</td>
                    <td className="p-2">{order.fields.Fatoura ?? "-"}</td>
                    <td className="p-2">
                      {order.fields.DeliveryDate
                        ? new Date(
                            order.fields.DeliveryDate,
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">{order.fields.OrderStatus}</td>
                    <td className="p-2">
                      {order.fields.LinkedOrder ? (
                        <Badge variant="secondary">Linked</Badge>
                      ) : (
                        <Badge variant="outline">Available</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDialogConfirm}
              disabled={selectedDialogIds.length === 0}
            >
              Add Selected ({selectedDialogIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
