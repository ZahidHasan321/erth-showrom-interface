"use client";

import { createOrder, updateOrder } from "@/api/orders";
import { updateShelf } from "@/api/shelves";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
} from "@/components/forms/customer-demographics/schema";
import { OrderTypeAndPaymentForm } from "@/components/forms/order-type-and-payment";
import {
  PaymentTypeForm,
  paymentTypeSchema,
} from "@/components/forms/payment-type";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import {
  shelvesFormSchema,
  type ShelvesFormValues,
} from "@/components/forms/shelved-products/schema";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { mapApiOrderToFormOrder, mapFormOrderToApiOrder } from "@/lib/order-mapper";
import { orderDefaults, orderSchema, type OrderSchema } from "@/schemas/work-order-schema";
import { createSalesOrderStore } from "@/store/current-sales-order";
import { type Order } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useInView } from "framer-motion";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/$main/orders/new-sales-order")({
  component: NewSalesOrder,
  head: () => ({
    meta: [{ title: "New Sales Order" }],
  }),
});

const steps = [
  { title: "Demographics", id: "step-0" },
  { title: "Shelves Products", id: "step-1" },
  { title: "Order & Payment Info", id: "step-2" },
  { title: "Confirmation & Payment", id: "step-3" },
];

const useCurrentSalesOrderStore = createSalesOrderStore("main");

function NewSalesOrder() {
  const [askedToCreateOrder, setAskedToCreateOrder] = React.useState(false);
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  const queryClient = useQueryClient()

  // Zustand store
  const currentStep = useCurrentSalesOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentSalesOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentSalesOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentSalesOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentSalesOrderStore((s) => s.removeSavedStep);
  const customerDemographics = useCurrentSalesOrderStore(
    (s) => s.customerDemographics
  );
  const setCustomerDemographics = useCurrentSalesOrderStore(
    (s) => s.setCustomerDemographics
  );
  const orderId = useCurrentSalesOrderStore((s) => s.orderId);
  const setOrderId = useCurrentSalesOrderStore((s) => s.setOrderId);
  const order = useCurrentSalesOrderStore((s) => s.order);
  const setOrder = useCurrentSalesOrderStore((s) => s.setOrder);
  const resetSalesOrder = useCurrentSalesOrderStore((s) => s.resetSalesOrder);

  React.useEffect(() => {
    return () => {
      resetSalesOrder();
    };
  }, [resetSalesOrder]);

  const { mutate: createNewOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ fields: { OrderStatus: "Pending" } }),
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data as Order;
        const formattedOrder = mapApiOrderToFormOrder(order);
        setOrderId(order.id);
        setOrder(formattedOrder);
        toast.success("New sales order created successfully!");
      }
    },
    onError: () => toast.error("Failed to create new sales order."),
  });


  type UpdateOrderPayload = {
    fields: Partial<OrderSchema>;
    orderId: string;
    onSuccessAction?: "customer" | "payment" | "fabric" | "campaigns" | "updated" | "cancelled" | null;
  };

  const { mutate: updateOrderFn } = useMutation({
    mutationFn: ({ fields, orderId }: UpdateOrderPayload) => {
      const orderMapped = mapFormOrderToApiOrder(fields);
      return updateOrder(orderMapped["fields"], orderId);
    },
    onSuccess: (_response, variables) => {
      // variables contains what you passed to mutate()
      if (variables.onSuccessAction === "customer") {
        toast.success("Customer updated ✅");
        setOrder(variables.fields);
        setCustomerDemographics(demographicsForm.getValues());
        handleProceed(0); // move to next step
      } else if (variables.onSuccessAction === "updated") {
        toast.success("Order updated successfully✅");
        handleProceed(4);
      } else if (variables.onSuccessAction === "cancelled") {
        toast.success("Order cancelled");
      }
    },
    onError: () => toast.error("Failed to update order"),
  });

  const { mutate: updateShelfFn } = useMutation({
    mutationFn: (shelvedData: ShelvesFormValues) => {
      const promises = shelvedData.products.map((item) => {
        if (item.id && item.Stock && item.quantity)
          return updateShelf(item.id, { Stock: item.Stock - item.quantity });
      });
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error("Unable to update the shelves stock");
    },
  });

  // ---------------------------
  // Forms
  // ---------------------------
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults,
  });

  const ShelvesForm = useForm<ShelvesFormValues>({
    resolver: zodResolver(shelvesFormSchema),
    defaultValues: {
      products: [],
    },
  });
  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: "cash",
      otherPaymentType: "",
      paymentRefNo: "",
    },
  });

  const OrderForm = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderDefaults,
  });

  const orderStatus = useWatch({
    control: OrderForm.control,
    name: "orderStatus",
  });

  const isOrderClosed = orderStatus === "Completed" || orderStatus === "Cancelled";

  const products = useWatch({
    control: ShelvesForm.control,
    name: "products",
  });

  const totalShelveAmount =
    products?.reduce(
      (acc, p) => acc + (p.quantity ?? 0) * (p.unitPrice ?? 0),
      0
    ) ?? 0;

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", totalShelveAmount);
  }, [totalShelveAmount, OrderForm]);

  // ---------------------------
  // Dynamic step visibility tracking
  // ---------------------------
  const sectionRefs = steps.map(() =>
    React.useRef<HTMLDivElement | null>(null)
  );
  const inViewStates = sectionRefs.map((ref) =>
    useInView(ref, { amount: 0.5, margin: "-10% 0px -40% 0px" })
  );

  React.useEffect(() => {
    const activeIndex = inViewStates.findIndex((isInView) => isInView);
    if (activeIndex !== -1 && activeIndex !== currentStep) {
      setCurrentStep(activeIndex);
    }
  }, [inViewStates, currentStep, setCurrentStep]);

  const handleStepChange = (i: number) => {
    sectionRefs[i].current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleProceed = (step: number) => {
    addSavedStep(step);
    handleStepChange(step + 1);
  };

  // ---------------------------
  // Order creation prompt
  // ---------------------------
  React.useEffect(() => {
    if (!orderId && !askedToCreateOrder) {
      setAskedToCreateOrder(true);
      setConfirmationDialog({
        isOpen: true,
        title: "Create New Sales Order",
        description: "Do you want to create a new sales order?",
        onConfirm: () => {
          createNewOrder();
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  }, [orderId, askedToCreateOrder, createNewOrder]);

  const handleOrderConfirmation = () => {
    // Check if all steps EXCEPT the confirmation step are complete
    const requiredSteps = steps.length - 1; // Exclude the last confirmation step
    if (savedSteps.length < requiredSteps) {
      toast.error("Complete all the steps before confirming order!!");
      return;
    }
    // check address for home delivery
    const isAddressDefined = Object.values(
      demographicsForm.getValues().address
    ).every((value) => value !== undefined && value.trim() != "");
    if (
      OrderForm.getValues().orderType === "homeDelivery" &&
      !isAddressDefined
    ) {
      toast.error("Need address for home delivery");
      return;
    }
    const currentStore = useCurrentSalesOrderStore.getState();
    console.log("🧾 Full Sales Order Store:", currentStore);



    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderStatus: "Completed",
      orderDate: new Date().toISOString(),
    };
    OrderForm.setValue("orderStatus", "Completed")
    setOrder(formOrder);
    if (orderId) {
      updateOrderFn({ fields: formOrder, orderId: orderId, onSuccessAction: "updated" });
    }

    // update stocks
    updateShelfFn(ShelvesForm.getValues());

    handleProceed(3);
  };

  // ---------------------------
  // Rendering
  // ---------------------------
  if (!orderId && !askedToCreateOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Preparing new sales order...</p>
      </div>
    );
  }

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to create a new sales order before proceeding.
        </p>
        <Button
          size="lg"
          onClick={() =>
            setConfirmationDialog({
              isOpen: true,
              title: "Create New Sales Order",
              description: "This will initialize a new order entry.",
              onConfirm: () => {
                createNewOrder();
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
              },
            })
          }
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Sales Order"}
        </Button>
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() =>
            setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
      </div>
    );
  }

  return (
    <div className="mb-64">
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() =>
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
      />

      {/* Stepper */}
      <div className="sticky w-full top-0 z-10 bg-white dark:bg-gray-950 shadow-md">
        <HorizontalStepper
          steps={steps}
          completedSteps={savedSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
        {/* Order Info Card */}
        <div className="w-fit absolute right-2.5 flex justify-end mt-2">
          <div className="bg-card p-4 shadow-lg rounded-lg z-10 border-b border-border max-w-xs mr-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Sales Order #{order.orderID}
            </h2>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <span className="font-medium text-green-600">
                {order.orderStatus ?? "Pending"}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Customer:{" "}
              <span className="font-medium">
                {order.customerID?.length
                  ? customerDemographics.nickName
                  : "No customer yet"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-10 py-10 mx-[10%]">
        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            ref={sectionRefs[index]}
            className="w-full flex flex-col items-center"
          >
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                isOrderClosed={isOrderClosed}
                onProceed={() => {
                  const recordID =
                    demographicsForm.getValues("customerRecordId");
                  if (orderId && recordID) {
                    updateOrderFn({
                      fields: {
                        customerID: [recordID],
                      },
                      orderId: orderId!,
                      onSuccessAction: "customer",
                    });
                  }
                }}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onClear={() => removeSavedStep(0)}
              />
            )}

            {index === 1 && (
              <ShelvedProductsForm
                form={ShelvesForm}
                isOrderClosed={isOrderClosed}
                onProceed={() => handleProceed(1)}
              />
            )}

            {index === 2 && (
              <OrderTypeAndPaymentForm
                form={OrderForm}
                optional={false}
                onSubmit={(data) => {
                  setOrder(data);
                  if (orderId) {
                    updateOrderFn({
                      fields: data,
                      orderId: orderId,
                      onSuccessAction: "payment",
                    });
                  }
                }}
                onProceed={() => {
                  // handleProceed(2) is called in the onSuccess of the mutation
                }}
              />
            )}

            {index === 3 && (
              <PaymentTypeForm
                form={paymentForm}
                isOrderClosed={isOrderClosed}
                onConfirm={() => {
                  setConfirmationDialog({
                    isOpen: true,
                    title: "Confirm new work order",
                    description: "Do you want to confirm a new work order?",
                    onConfirm: () => {
                      handleOrderConfirmation();
                      setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
                    },
                  });
                }}
                onCancel={() => { }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}