"use client";

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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { OrderInfoCard } from "@/components/orders-at-showroom/OrderInfoCard";
import { OrderCreationPrompt } from "@/components/orders-at-showroom/OrderCreationPrompt";
import { orderDefaults, orderSchema, type OrderSchema } from "@/schemas/work-order-schema";
import { createSalesOrderStore } from "@/store/current-sales-order";
import { useOrderMutations } from "@/hooks/useOrderMutations";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
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
  // ============================================================================
  // STATE & STORE
  // ============================================================================
  const [askedToCreateOrder, setAskedToCreateOrder] = React.useState(false);

  // Store selectors
  const currentStep = useCurrentSalesOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentSalesOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentSalesOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentSalesOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentSalesOrderStore((s) => s.removeSavedStep);
  const customerDemographics = useCurrentSalesOrderStore((s) => s.customerDemographics);
  const setCustomerDemographics = useCurrentSalesOrderStore((s) => s.setCustomerDemographics);
  const orderId = useCurrentSalesOrderStore((s) => s.orderId);
  const setOrderId = useCurrentSalesOrderStore((s) => s.setOrderId);
  const order = useCurrentSalesOrderStore((s) => s.order);
  const setOrder = useCurrentSalesOrderStore((s) => s.setOrder);
  const resetSalesOrder = useCurrentSalesOrderStore((s) => s.resetSalesOrder);

  // ============================================================================
  // FORMS SETUP
  // ============================================================================
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults,
  });

  const ShelvesForm = useForm<ShelvesFormValues>({
    resolver: zodResolver(shelvesFormSchema),
    defaultValues: { products: [] },
  });

  const OrderForm = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderDefaults,
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: "cash",
      otherPaymentType: "",
      paymentRefNo: "",
    },
  });

  // Watch form values
  const orderStatus = useWatch({
    control: OrderForm.control,
    name: "orderStatus",
  });

  const products = useWatch({
    control: ShelvesForm.control,
    name: "products",
  });

  const isOrderClosed = orderStatus === "Completed" || orderStatus === "Cancelled";

  const totalShelveAmount =
    products?.reduce((acc, p) => acc + (p.quantity ?? 0) * (p.unitPrice ?? 0), 0) ?? 0;

  // ============================================================================
  // NAVIGATION & UI HOOKS
  // ============================================================================
  const { dialog, openDialog, closeDialog } = useConfirmationDialog();

  const { sectionRefs, handleStepChange, handleProceed } = useStepNavigation({
    steps,
    setCurrentStep,
    addSavedStep,
  });

  // ============================================================================
  // ORDER MUTATIONS
  // ============================================================================
  const {
    createOrder: createOrderMutation,
    updateOrder: updateOrderMutation,
    updateShelf: updateShelfMutation,
  } = useOrderMutations({
    onOrderCreated: (id, formattedOrder) => {
      setOrderId(id);
      setOrder(formattedOrder);
    },
    onOrderUpdated: (action) => {
      if (action === "customer") {
        setOrder(OrderForm.getValues());
        setCustomerDemographics(demographicsForm.getValues());
        handleProceed(0);
      } else if (action === "updated") {
        handleProceed(3);
      }
    },
  });

  // ============================================================================
  // DEMOGRAPHICS FORM HANDLERS
  // ============================================================================
  const handleDemographicsProceed = () => {
    const recordID = demographicsForm.getValues("customerRecordId");
    if (orderId && recordID) {
      updateOrderMutation.mutate({
        fields: { customerID: [recordID] },
        orderId: orderId,
        onSuccessAction: "customer",
      });
    }
  };

  // ============================================================================
  // SHELVES FORM HANDLERS
  // ============================================================================
  const handleShelvesProceed = () => {
    handleProceed(1);
  };

  // ============================================================================
  // ORDER & PAYMENT HANDLERS
  // ============================================================================
  const handleOrderFormSubmit = (data: Partial<OrderSchema>) => {
    setOrder(data);
    if (orderId) {
      updateOrderMutation.mutate({
        fields: data,
        orderId: orderId,
        onSuccessAction: "payment",
      });
    }
  };

  // ============================================================================
  // ORDER CONFIRMATION
  // ============================================================================
  const validateOrderCompletion = () => {
    const requiredSteps = steps.length - 1;
    if (savedSteps.length < requiredSteps) {
      toast.error("Complete all the steps before confirming order!!");
      return false;
    }

    const isAddressDefined = Object.values(demographicsForm.getValues().address).every(
      (value) => value !== undefined && value.trim() !== ""
    );

    if (OrderForm.getValues().orderType === "homeDelivery" && !isAddressDefined) {
      toast.error("Need address for home delivery");
      return false;
    }

    return true;
  };

  const handleOrderConfirmation = () => {
    if (!validateOrderCompletion()) return;

    console.log("🧾 Full Sales Order Store:", useCurrentSalesOrderStore.getState());

    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderStatus: "Completed",
      orderDate: new Date().toISOString(),
    };

    OrderForm.setValue("orderStatus", "Completed");
    setOrder(formOrder);

    if (orderId) {
      updateOrderMutation.mutate({
        fields: formOrder,
        orderId: orderId,
        onSuccessAction: "updated",
      });
    }

    // Update stocks
    updateShelfMutation.mutate(ShelvesForm.getValues());

    handleProceed(3);
  };

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================
  // Sync shelf amount to order charges
  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", totalShelveAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalShelveAmount]);

  // Prompt for order creation on mount
  React.useEffect(() => {
    if (!orderId && !askedToCreateOrder) {
      setAskedToCreateOrder(true);
      openDialog(
        "Create New Sales Order",
        "Do you want to create a new sales order?",
        () => {
          createOrderMutation.mutate();
          closeDialog();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, askedToCreateOrder]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      resetSalesOrder();
    };
  }, [resetSalesOrder]);

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================
  if (!orderId && !askedToCreateOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Preparing new sales order...</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER: NO ORDER STATE
  // ============================================================================
  if (!orderId) {
    return (
      <OrderCreationPrompt
        orderType="Sales Order"
        isPending={createOrderMutation.isPending}
        onCreateOrder={() => {
          openDialog(
            "Create New Sales Order",
            "This will initialize a new order entry.",
            () => {
              createOrderMutation.mutate();
              closeDialog();
            }
          );
        }}
        dialogState={dialog}
        onCloseDialog={closeDialog}
      />
    );
  }

  // ============================================================================
  // RENDER: MAIN ORDER FLOW
  // ============================================================================
  return (
    <div className="mb-64">
      <ConfirmationDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        description={dialog.description}
      />

      {/* Sticky Header with Stepper */}
      <div className="sticky w-full top-0 z-10 bg-white dark:bg-gray-950 shadow-md">
        <HorizontalStepper
          steps={steps}
          completedSteps={savedSteps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
        />
        <OrderInfoCard
          orderID={order.orderID}
          orderStatus={order.orderStatus ?? "Pending"}
          customerName={order.customerID?.length ? customerDemographics.nickName : undefined}
          orderType="Sales Order"
          deliveryType={order.orderType}
          paymentType={order.paymentType}
          totalAmount={order.charges ? Object.values(order.charges).reduce((a, b) => a + b, 0) : 0}
          advance={order.advance}
          balance={order.balance}
        />
      </div>

      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center gap-40 py-10 mx-[10%]">
        {/* STEP 0: Demographics */}
        <div
          id={steps[0].id}
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <CustomerDemographicsForm
            form={demographicsForm}
            isOrderClosed={isOrderClosed}
            onProceed={handleDemographicsProceed}
            onEdit={() => removeSavedStep(0)}
            onCancel={() => addSavedStep(0)}
            onClear={() => removeSavedStep(0)}
          />
        </div>

        {/* STEP 1: Shelved Products */}
        <div
          id={steps[1].id}
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ShelvedProductsForm
            form={ShelvesForm}
            isOrderClosed={isOrderClosed}
            onProceed={handleShelvesProceed}
          />
        </div>

        {/* STEP 2: Order & Payment Info */}
        <div
          id={steps[2].id}
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <OrderTypeAndPaymentForm
            form={OrderForm}
            optional={false}
            onSubmit={handleOrderFormSubmit}
            onProceed={() => {}}
            customerAddress={customerDemographics?.address}
          />
        </div>

        {/* STEP 3: Confirmation & Payment */}
        <div
          id={steps[3].id}
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <PaymentTypeForm
            form={paymentForm}
            isOrderClosed={isOrderClosed}
            onConfirm={() => {
              openDialog(
                "Confirm new sales order",
                "Do you want to confirm a new sales order?",
                () => {
                  handleOrderConfirmation();
                  closeDialog();
                }
              );
            }}
            onCancel={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
