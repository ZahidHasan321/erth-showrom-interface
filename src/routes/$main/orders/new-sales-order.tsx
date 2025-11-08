"use client";

import { getEmployees } from "@/api/employees";
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
import { orderDefaults, orderSchema, type OrderSchema } from "@/schemas/work-order-schema";
import { createSalesOrderStore } from "@/store/current-sales-order";
import { useOrderMutations } from "@/hooks/useOrderMutations";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
  // DATA FETCHING
  // ============================================================================
  const { data: employeesResponse } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const employees = employeesResponse?.data || [];

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

  const OrderForm = useForm<OrderSchema>({
    resolver: zodResolver(orderSchema) as any,
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
    updateShelf: updateShelfMutation,
  } = useOrderMutations({
    orderType: "sales",
    onOrderCreated: (id, formattedOrder) => {
      setOrderId(id);
      setOrder(formattedOrder);
      // Update stocks after order is created
      updateShelfMutation.mutate(ShelvesForm.getValues());
      // toast.success("Sales order completed successfully! ✅");
      handleProceed(3);
    },
    onOrderUpdated: (action) => {
      if (action === "updated") {
        handleProceed(3);
      }
    },
  });

  // ============================================================================
  // DEMOGRAPHICS FORM HANDLERS
  // ============================================================================
  const handleDemographicsProceed = () => {
    const recordID = demographicsForm.getValues("customerRecordId");
    if (!recordID) {
      toast.error("Please save customer information first");
      return;
    }
    // Update OrderForm with customerID for later use
    OrderForm.setValue("customerID", [recordID]);
    setCustomerDemographics(demographicsForm.getValues());
    handleProceed(0);
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
  };

  const handleOrderFormProceed = () => {
    handleProceed(2);
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

    if (OrderForm.getValues().homeDelivery && !isAddressDefined) {
      toast.error("Need address for home delivery");
      return false;
    }

    return true;
  };

  const handleOrderConfirmation = () => {
    if (!validateOrderCompletion()) return;

    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderStatus: "Completed",
      orderDate: new Date().toISOString(),
    };

    OrderForm.setValue("orderStatus", "Completed");
    setOrder(formOrder);

    // Create the order with all the data
    createOrderMutation.mutate(formOrder);
  };

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================
  // Sync shelf amount to order charges
  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", totalShelveAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalShelveAmount]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      resetSalesOrder();
    };
  }, [resetSalesOrder]);

  // ============================================================================
  // INVOICE DATA PREPARATION
  // ============================================================================
  const invoiceData = React.useMemo(() => {
    const demographics = demographicsForm.getValues();
    const orderData = OrderForm.getValues();
    const paymentData = paymentForm.getValues();
    const shelvesData = ShelvesForm.getValues().products;

    // Find employee name
    const orderTakerEmployee = employees.find(
      (emp) => emp.id === paymentData.orderTaker
    );

    return {
      orderId: order.orderID,
      orderDate: orderData.orderDate,
      homeDelivery: orderData.homeDelivery,
      orderStatus: orderData.orderStatus,
      customerName: demographics.nickName,
      customerPhone: demographics.mobileNumber,
      customerAddress: demographics.address,
      fabricSelections: [],
      shelvedProducts: shelvesData,
      charges: orderData.charges,
      discountType: orderData.discountType,
      discountValue: orderData.discountValue,
      discountPercentage: orderData.discountPercentage,
      advance: orderData.advance,
      paid: orderData.paid,
      paymentType: paymentData.paymentType,
      otherPaymentType: paymentData.otherPaymentType,
      paymentRefNo: paymentData.paymentRefNo,
      orderTaker: orderTakerEmployee?.fields.Name,
    };
  }, [
    demographicsForm,
    OrderForm,
    paymentForm,
    ShelvesForm,
    order.orderID,
    employees,
  ]);

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
            onProceed={handleOrderFormProceed}
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
            invoiceData={invoiceData}
            orderRecordId={orderId}
            orderStatus={orderStatus}
            useFatoura={false}
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
