"use client";

import { createOrder } from "@/api/orders";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
} from "@/components/forms/customer-demographics/schema";
import {
  orderTypeAndPaymentDefaults,
  OrderTypeAndPaymentForm,
  orderTypeAndPaymentSchema,
} from "@/components/forms/order-type-and-payment";
import { PaymentTypeForm, paymentTypeSchema } from "@/components/forms/payment-type";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { shelvesFormSchema, type ShelvesFormValues } from "@/components/forms/shelved-products/schema";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { mapApiOrderToFormOrder } from "@/lib/order-mapper";
import { createSalesOrderStore } from "@/store/current-sales-order";
import { type Order } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useInView } from "framer-motion";
import * as React from "react";
import { useForm } from "react-hook-form";
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

  // Zustand store
  const currentStep = useCurrentSalesOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentSalesOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentSalesOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentSalesOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentSalesOrderStore((s) => s.removeSavedStep);
  const customerDemographics = useCurrentSalesOrderStore((s) => s.customerDemographics);
  const setCustomerDemographics = useCurrentSalesOrderStore(
    (s) => s.setCustomerDemographics
  );
  // const shelvedProducts = useCurrentSalesOrderStore((s) => s.shelvedProducts);
  const orderId = useCurrentSalesOrderStore((s) => s.orderId);
  const setOrderId = useCurrentSalesOrderStore((s) => s.setOrderId);
  const setOrder = useCurrentSalesOrderStore((s) => s.setOrder);
  const setPaymentType = useCurrentSalesOrderStore((s) => s.setPaymentType);
  const setOtherPaymentType = useCurrentSalesOrderStore(
    (s) => s.setOtherPaymentType
  );
  const setPaymentRefNo = useCurrentSalesOrderStore((s) => s.setPaymentRefNo);
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
        setOrderId(order.fields?.OrderID ?? null);
        setOrder(formattedOrder);
        toast.success("New sales order created successfully!");
      }
    },
    onError: () => toast.error("Failed to create new sales order."),
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
      products: []
    }
  })
  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: "cash",
      otherPaymentType: "",
      paymentRefNo: "",
    },
  });

  const OrderForm = useForm<z.infer<typeof orderTypeAndPaymentSchema>>({
    resolver: zodResolver(orderTypeAndPaymentSchema),
    defaultValues: orderTypeAndPaymentDefaults,
  });

  // ---------------------------
  // Dynamic step visibility tracking
  // ---------------------------
  const sectionRefs = steps.map(() => React.useRef<HTMLDivElement | null>(null));
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
    sectionRefs[i].current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleProceed = (step: number) => {
    addSavedStep(step);
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
      </div>

      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-20 p-4 xl:p-0 w-full">
        <p>Order ID: {orderId}</p>

        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            ref={sectionRefs[index]}
            className="w-full flex flex-col items-center max-w-7xl"
          >
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSave={(data) => {
                  setCustomerDemographics(data);
                  toast.success("Customer Demographics saved ✅");
                }}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onProceed={() => {
                  if (orderId && customerDemographics.customerRecordId) {
                    setOrder({ CustomerID: [customerDemographics.customerRecordId] });
                    handleProceed(0);
                  }
                }}
                onClear={() => removeSavedStep(0)}
              />
            )}

            {index === 1 && (
              <ShelvedProductsForm
                form={ShelvesForm}
                onProceed={() => handleProceed(1)}
              />
            )}

            {index === 2 && (
              <OrderTypeAndPaymentForm
                form={OrderForm}
                optional={false}
                onSubmit={(data) => {
                  setOrder(data);
                  toast.success("Order & Payment Info saved ✅");
                }}
                onProceed={() => handleProceed(2)}
              />
            )}

            {index === 3 && (
              <PaymentTypeForm
                form={paymentForm}
                onSubmit={(data) => {
                  setPaymentType(data.paymentType);
                  setOtherPaymentType(data.otherPaymentType || null);
                  setPaymentRefNo(data.paymentRefNo || null);
                  toast.success("Sales Order Confirmed ✅");
                  handleProceed(3);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
