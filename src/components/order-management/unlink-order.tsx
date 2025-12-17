import {
  searchOrders,
  getPendingOrdersByCustomer,
  updateOrder,
  getOrderById,
} from "@/api/orders";
import { searchCustomerByPhone, getCustomerByRecordId } from "@/api/customers";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

// UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { toast } from "sonner";

import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";
import type { ApiResponse } from "@/types/api";
import { DatePicker } from "../ui/date-picker";

export default function UnlinkOrder() {
  // --- Search Inputs ---
  const [orderId, setOrderId] = useState<number | undefined>();
  const [fatoura, setFatoura] = useState<number | undefined>();
  const [customerMobile, setCustomerMobile] = useState<number | undefined>();
  const [reviseDate, setReviseDate] = useState<Date | null>(null);

  // --- Order & Customer State ---
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [customerInfo, setCustomerInfo] = useState<Customer | null>(null);
  const [linkedOrdersDetails, setLinkedOrdersDetails] = useState<Order[]>([]);

  // --- Loading States ---
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingLinkedOrders, setIsLoadingLinkedOrders] = useState(false);

  // --- Dialog State ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [selectedDialogOrderId, setSelectedDialogOrderId] = useState<
    string | null
  >(null);

  // --- Single Order Search Query ---
  const { refetch: searchSingleOrder, isFetching: isSearchingSingle } =
    useQuery<ApiResponse<Order[]>>({
      queryKey: ["searchOrderForUnlink", orderId, fatoura],
      queryFn: () => {
        if (orderId) return searchOrders({ orderId: orderId.toString() });
        if (fatoura) return searchOrders({ fatoura: fatoura.toString() });
        throw new Error("Missing search parameter");
      },
      enabled: false,
    });

  // --- Fetch Customer Info when order is found ---
  useEffect(() => {
    async function fetchCustomerInfo() {
      if (!foundOrder?.fields.CustomerID?.[0]) {
        setCustomerInfo(null);
        return;
      }

      setIsLoadingCustomer(true);
      try {
        const response = await getCustomerByRecordId(
          foundOrder.fields.CustomerID[0],
        );
        if (response.data) {
          setCustomerInfo(response.data);
        } else {
          setCustomerInfo(null);
        }
      } catch (error) {
        console.error("Failed to fetch customer info", error);
        setCustomerInfo(null);
      } finally {
        setIsLoadingCustomer(false);
      }
    }

    fetchCustomerInfo();
  }, [foundOrder]);

  // --- Fetch Linked Order Details ---
  useEffect(() => {
    async function fetchLinkedOrders() {
      if (
        !foundOrder?.fields.LinkedTo ||
        foundOrder.fields.LinkedTo.length === 0
      ) {
        setLinkedOrdersDetails([]);
        return;
      }

      setIsLoadingLinkedOrders(true);
      try {
        const promises = foundOrder.fields.LinkedTo.map((id) =>
          getOrderById(id),
        );
        const responses = await Promise.all(promises);
        const orders = responses
          .map((res) => res.data)
          .filter(Boolean) as Order[];
        setLinkedOrdersDetails(orders);
      } catch (error) {
        console.error("Failed to fetch linked orders", error);
        setLinkedOrdersDetails([]);
      } finally {
        setIsLoadingLinkedOrders(false);
      }
    }

    fetchLinkedOrders();
  }, [foundOrder]);

  // --- Main Form Submit ---
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Handle Customer Search
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
          setSelectedDialogOrderId(null);
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

    // 2. Handle Single Order Search
    if (orderId || fatoura) {
      searchSingleOrder().then(({ data }) => {
        if (!data || !data.data || data.data.length === 0) {
          toast.error("No order found with the provided criteria.");
          return;
        }
        setFoundOrder(data.data[0]);
      });
    }
  }

  // --- Dialog Handlers ---
  function handleDialogConfirm() {
    if (!selectedDialogOrderId) {
      toast.error("Please select an order.");
      return;
    }
    const order = customerOrders.find((o) => o.id === selectedDialogOrderId);
    if (order) {
      setFoundOrder(order);
      setIsDialogOpen(false);
    }
  }

  // --- Unlink Handler ---
  async function handleUnlink() {
    if (!foundOrder) {
      toast.error("No order selected to unlink.");
      return;
    }

    if (foundOrder.fields.UnlinkedOrder) {
      toast.info("This order is already unlinked.");
      return;
    }

    if (!foundOrder.fields.LinkedOrder) {
      toast.info("This order was never linked.");
      return;
    }

    if (!reviseDate) {
      toast.error("Please select a new delivery date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: Partial<Order["fields"]> = {
        LinkedOrder: false,
        UnlinkedOrder: true,
        UnlinkedDate: new Date().toISOString(),
        DeliveryDate: reviseDate.toISOString(),
      };

      await updateOrder(updateData, foundOrder.id);

      toast.success("Order unlinked successfully! Delivery date updated.");
      setTimeout(() => handleClear(), 2000);
    } catch (error) {
      console.error("Unlink failed", error);
      toast.error("Failed to unlink order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  function getOrderStatusBadge() {
    if (foundOrder?.fields.UnlinkedOrder)
      return { label: "Unlinked", variant: "secondary" as const };
    if (foundOrder?.fields.LinkedOrder)
      return { label: "Linked", variant: "default" as const };
    return { label: "Not Linked", variant: "outline" as const };
  }
  // --- Clear/Search Again Handler ---
  function handleClear() {
    setFoundOrder(null);
    setCustomerInfo(null);
    setLinkedOrdersDetails([]);
    setReviseDate(null); // NEW
    setOrderId(undefined);
    setFatoura(undefined);
    setCustomerMobile(undefined);
    setCustomerOrders([]);
    setSelectedDialogOrderId(null);
  }

  const isFetching =
    isSearchingSingle ||
    isSearchingCustomer ||
    isLoadingCustomer ||
    isLoadingLinkedOrders;

  return (
    <section className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Unlink Order</h1>

      {/* --- Search Form --- */}
      {!foundOrder && (
        <Card>
          <CardContent className="pt-6">
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
                  onChange={(e) =>
                    setOrderId(e.target.valueAsNumber || undefined)
                  }
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Fatoura"
                  value={fatoura ?? ""}
                  disabled={!!orderId || !!customerMobile}
                  onChange={(e) =>
                    setFatoura(e.target.valueAsNumber || undefined)
                  }
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
                disabled={
                  isFetching || (!orderId && !fatoura && !customerMobile)
                }
              >
                {isFetching ? "Searching..." : "Search Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* --- Order Display Card --- */}
      {foundOrder && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <Badge variant={getOrderStatusBadge().variant}>
                {getOrderStatusBadge().label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Order ID:</span>
                  <p className="font-semibold">
                    {foundOrder.fields.OrderID ?? "-"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fatoura:</span>
                  <p className="font-semibold">
                    {foundOrder.fields.Fatoura ?? "-"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery Date:</span>
                  <p className="font-semibold">
                    {foundOrder.fields.DeliveryDate
                      ? format(new Date(foundOrder.fields.DeliveryDate), "PPP")
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Status:</span>
                  <p className="font-semibold">
                    {foundOrder.fields.OrderStatus}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Linked:</span>
                  <p className="font-semibold">
                    {foundOrder.fields.LinkedOrder ? "Yes" : "No"}
                  </p>
                </div>
                {foundOrder.fields.LinkedDate && (
                  <div>
                    <span className="text-muted-foreground">Linked Date:</span>
                    <p className="font-semibold">
                      {format(new Date(foundOrder.fields.LinkedDate), "PPP")}
                    </p>
                  </div>
                )}
                <div className="col-span-2 pt-2">
                  <Label className="text-sm font-medium">
                    Set New Delivery Date:
                  </Label>
                  <DatePicker
                    value={reviseDate}
                    onChange={setReviseDate}
                    placeholder="Pick delivery date"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Linked Orders Details */}
              {isLoadingLinkedOrders ? (
                <div className="text-sm text-muted-foreground">
                  Loading linked orders...
                </div>
              ) : (
                linkedOrdersDetails.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3">
                      Linked Orders Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {linkedOrdersDetails.map((linkedOrder) => (
                        <div
                          key={linkedOrder.id}
                          className="text-sm p-3 bg-muted/10 rounded-md space-y-1"
                        >
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Order ID:
                            </span>
                            <span className="font-medium">
                              {linkedOrder.fields.OrderID ?? "-"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Fatoura:
                            </span>
                            <span className="font-medium">
                              {linkedOrder.fields.Fatoura ?? "-"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Customer Information */}
              {isLoadingCustomer ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Loading customer info...</span>
                </div>
              ) : customerInfo ? (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-semibold">
                        {customerInfo.fields.Name}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-semibold">
                        {customerInfo.fields.Phone}
                      </p>
                    </div>
                    {customerInfo.fields.NickName && (
                      <div>
                        <span className="text-muted-foreground">Nickname:</span>
                        <p className="font-semibold">
                          {customerInfo.fields.NickName}
                        </p>
                      </div>
                    )}
                    {customerInfo.fields.Email && (
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-semibold">
                          {customerInfo.fields.Email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t text-sm text-muted-foreground">
                  Customer information not available.
                </div>
              )}

              {/* --- Action Buttons --- */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleUnlink}
                  variant="destructive"
                  disabled={
                    isSubmitting ||
                    !foundOrder.fields.LinkedOrder ||
                    foundOrder.fields.UnlinkedOrder ||
                    !reviseDate
                  }
                >
                  {isSubmitting ? "Unlinking..." : "Unlink Order"}
                </Button>
                <Button onClick={handleClear} variant="outline">
                  Search Again
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- Info Alert --- */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> This will mark a linked order as
                unlinked, update the delivery date to today, but preserve the
                original linked IDs and date for audit purposes. Orders that
                were never linked cannot be unlinked.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Customer Order Selection Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select an Order to Unlink</DialogTitle>
          </DialogHeader>

          <RadioGroup
            value={selectedDialogOrderId ?? undefined}
            onValueChange={setSelectedDialogOrderId}
            className="max-h-[300px] overflow-y-auto border rounded-md"
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  <th className="p-2 w-10 bg-muted">Select</th>
                  <th className="p-2 text-left bg-muted">Order ID</th>
                  <th className="p-2 text-left bg-muted">Date</th>
                  <th className="p-2 text-left bg-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-muted/10">
                    <td className="p-2">
                      <RadioGroupItem
                        value={order.id}
                        id={order.id}
                        className="ml-2"
                      />
                    </td>
                    <td className="p-2">
                      <Label htmlFor={order.id}>{order.fields.OrderID}</Label>
                    </td>
                    <td className="p-2">
                      {order.fields.OrderDate
                        ? format(new Date(order.fields.OrderDate), "PPP")
                        : "-"}
                    </td>
                    <td className="p-2">{order.fields.OrderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RadioGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDialogConfirm}
              disabled={!selectedDialogOrderId}
            >
              Select Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
