"use client";

import { getFabrics } from "@/api/fabrics";
import { getStyles } from "@/api/styles";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import {
  customerDemographicsDefaults,
  customerDemographicsSchema,
} from "@/components/forms/customer-demographics/schema";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";
import {
  customerMeasurementsDefaults,
  customerMeasurementsSchema,
} from "@/components/forms/customer-measurements/schema";
import { FabricSelectionForm } from "@/components/forms/fabric-selection-and-options";
import {
  fabricSelectionSchema,
  type FabricSelectionSchema,
} from "@/components/forms/fabric-selection-and-options/fabric-selection/fabric-selection-schema";
import {
  styleOptionsSchema,
  type StyleOptionsSchema,
} from "@/components/forms/fabric-selection-and-options/style-options/style-options-schema";
import { OrderTypeAndPaymentForm } from "@/components/forms/order-type-and-payment";
import { paymentTypeSchema } from "@/components/forms/payment-type";
import { PaymentTypeForm } from "@/components/forms/payment-type/payment-type-form";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import {
  shelvesFormSchema,
  type ShelvesFormValues,
} from "@/components/forms/shelved-products/schema";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { ErrorBoundary } from "@/components/global/error-boundary";
import { OrderInfoCard } from "@/components/orders-at-showroom/OrderInfoCard";
import { OrderCreationPrompt } from "@/components/orders-at-showroom/OrderCreationPrompt";
import {
  orderDefaults,
  orderSchema,
  type OrderSchema,
} from "@/schemas/work-order-schema";
import { createWorkOrderStore } from "@/store/current-work-order";
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

export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
  head: () => ({
    meta: [{ title: "New Work Order" }],
  }),
});

const steps = [
  { title: "Demographics", id: "step-0" },
  { title: "Measurement", id: "step-1" },
  { title: "Fabric Selection", id: "step-2" },
  { title: "Shelves Products", id: "step-3" },
  { title: "Order & Payment Info", id: "step-4" },
  { title: "Confirmation", id: "step-5" },
];

const useCurrentWorkOrderStore = createWorkOrderStore("main");

function NewWorkOrder() {
  // ============================================================================
  // DATA FETCHING & STORE
  // ============================================================================
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: stylesResponse } = useQuery({
    queryKey: ["styles"],
    queryFn: getStyles,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const styles = stylesResponse?.data || [];

  // Store selectors
  const currentStep = useCurrentWorkOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentWorkOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentWorkOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentWorkOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentWorkOrderStore((s) => s.removeSavedStep);
  const customerDemographics = useCurrentWorkOrderStore((s) => s.customerDemographics);
  const setCustomerDemographics = useCurrentWorkOrderStore((s) => s.setCustomerDemographics);
  const fabricSelections = useCurrentWorkOrderStore((s) => s.fabricSelections);
  const setFabricSelections = useCurrentWorkOrderStore((s) => s.setFabricSelections);
  const setStyleOptions = useCurrentWorkOrderStore((s) => s.setStyleOptions);
  const orderId = useCurrentWorkOrderStore((s) => s.orderId);
  const setOrderId = useCurrentWorkOrderStore((s) => s.setOrderId);
  const order = useCurrentWorkOrderStore((s) => s.order);
  const setOrder = useCurrentWorkOrderStore((s) => s.setOrder);
  const resetWorkOrder = useCurrentWorkOrderStore((s) => s.resetWorkOrder);

  // ============================================================================
  // FORMS SETUP
  // ============================================================================
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults,
  });

  const measurementsForm = useForm<z.infer<typeof customerMeasurementsSchema>>({
    resolver: zodResolver(customerMeasurementsSchema),
    defaultValues: customerMeasurementsDefaults,
  });

  const fabricSelectionForm = useForm<{
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }>({
    resolver: zodResolver(
      z.object({
        fabricSelections: z.array(fabricSelectionSchema),
        styleOptions: z.array(styleOptionsSchema),
      })
    ),
    defaultValues: { fabricSelections: [], styleOptions: [] },
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
    defaultValues: { paymentType: "cash" },
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
    updateFabricStock: updateFabricStockMutation,
  } = useOrderMutations({
    onOrderCreated: (id, formattedOrder) => {
      setOrderId(id);
      setOrder(formattedOrder);
      demographicsForm.reset();
      measurementsForm.reset();
      fabricSelectionForm.reset();
      ShelvesForm.reset();
      OrderForm.reset();
    },
    onOrderUpdated: (action) => {
      if (action === "customer") {
        // Save the updated order state to store
        const updatedOrder = OrderForm.getValues();
        setOrder(updatedOrder);
        handleProceed(0);
      } else if (action === "updated") {
        handleProceed(4);
      }
    },
    onOrderError: () => {
      resetWorkOrder();
    },
  });

  // ============================================================================
  // DEMOGRAPHICS FORM HANDLERS
  // ============================================================================
  const handleDemographicsProceed = () => {
    const recordID = demographicsForm.getValues("customerRecordId");
    const customerData = demographicsForm.getValues();


    if (!recordID) {
      toast.error("Please save customer information first");
      return;
    }

    // Update OrderForm with customerID
    OrderForm.setValue("customerID", [recordID]);

    // Update store with customer demographics
    setCustomerDemographics(customerData);

    // Update order in backend
    if (orderId) {
      updateOrderMutation.mutate({
        fields: { customerID: [recordID] },
        orderId: orderId,
        onSuccessAction: "customer",
      });
    }
  };

  // ============================================================================
  // MEASUREMENTS FORM HANDLERS
  // ============================================================================
  const handleMeasurementsProceed = () => {
    handleProceed(1);
  };

  // ============================================================================
  // FABRIC SELECTION HANDLERS
  // ============================================================================
  /**
   * Calculate stitching price from styles data
   * Uses the Stitch field from styles table for each selected style code
   */
  const calculateStitchingPrice = (styleOptions: StyleOptionsSchema[]) => {
    // Create a lookup map: Code -> Stitch value
    const styleStitchMap = new Map<string, number>();
    styles.forEach((style) => {
      const stitchValue = typeof style.fields.Stitch === "string"
        ? parseFloat(style.fields.Stitch)
        : style.fields.Stitch;
      styleStitchMap.set(style.fields.Code, stitchValue || 0);
    });

    let totalStitching = 0;

    styleOptions.forEach((styleOption) => {
      // Add stitching for all selected style codes
      if (styleOption.style) {
        const code = styleOption.style === "kuwaiti" ? "STY_KUWAITI" : "STY_DESIGNER";
        totalStitching += styleStitchMap.get(code) || 0;
      }

      if (styleOption.lines) {
        totalStitching += styleStitchMap.get("STY_LINE") || 0;
      }

      if (styleOption.collar?.collarType) {
        totalStitching += styleStitchMap.get(styleOption.collar.collarType) || 0;
      }

      if (styleOption.collar?.collarButton) {
        totalStitching += styleStitchMap.get(styleOption.collar.collarButton) || 0;
      }

      if (styleOption.jabzoor?.jabzour1) {
        totalStitching += styleStitchMap.get(styleOption.jabzoor.jabzour1) || 0;
      }

      if (styleOption.sidePocket?.side_pocket_type) {
        totalStitching += styleStitchMap.get(styleOption.sidePocket.side_pocket_type) || 0;
      }

      if (styleOption.frontPocket?.front_pocket_type) {
        totalStitching += styleStitchMap.get(styleOption.frontPocket.front_pocket_type) || 0;
      }

      if (styleOption.cuffs?.cuffs_type) {
        totalStitching += styleStitchMap.get(styleOption.cuffs.cuffs_type) || 0;
      }
    });

    return totalStitching;
  };

  /**
   * Calculate style price from styles data
   * Uses the RatePerItem field from styles table for each selected style code
   */
  const calculateStylePrice = (styleOptions: StyleOptionsSchema[]) => {
    // Create a lookup map: Code -> RatePerItem value
    const styleRateMap = new Map<string, number>();
    styles.forEach((style) => {
      styleRateMap.set(style.fields.Code, style.fields.RatePerItem || 0);
    });

    let totalStyle = 0;

    styleOptions.forEach((styleOption) => {
      // Add RatePerItem for all selected style codes
      if (styleOption.style) {
        const code = styleOption.style === "kuwaiti" ? "STY_KUWAITI" : "STY_DESIGNER";
        totalStyle += styleRateMap.get(code) || 0;
      }

      if (styleOption.lines) {
        totalStyle += styleRateMap.get("STY_LINE") || 0;
      }

      if (styleOption.collar?.collarType) {
        totalStyle += styleRateMap.get(styleOption.collar.collarType) || 0;
      }

      if (styleOption.collar?.collarButton) {
        totalStyle += styleRateMap.get(styleOption.collar.collarButton) || 0;
      }

      if (styleOption.jabzoor?.jabzour1) {
        totalStyle += styleRateMap.get(styleOption.jabzoor.jabzour1) || 0;
      }

      if (styleOption.sidePocket?.side_pocket_type) {
        totalStyle += styleRateMap.get(styleOption.sidePocket.side_pocket_type) || 0;
      }

      if (styleOption.frontPocket?.front_pocket_type) {
        totalStyle += styleRateMap.get(styleOption.frontPocket.front_pocket_type) || 0;
      }

      if (styleOption.cuffs?.cuffs_type) {
        totalStyle += styleRateMap.get(styleOption.cuffs.cuffs_type) || 0;
      }
    });

    return totalStyle;
  };

  const calculateFabricPrice = (fabricSelections: FabricSelectionSchema[]) => {
    let fabricPrice = 0;
    fabricSelections.forEach((fabric) => {
      if (fabric.fabricAmount) fabricPrice += fabric.fabricAmount;
    });
    return fabricPrice;
  };

  const handleFabricSelectionSubmit = (data: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }) => {
    setFabricSelections(data.fabricSelections);
    setStyleOptions(data.styleOptions);
    addSavedStep(2);

    // Update number of fabrics
    const numFabrics = data.fabricSelections.length;
    OrderForm.setValue("numOfFabrics", numFabrics);
    setOrder({ ...order, numOfFabrics: numFabrics });

    // Calculate prices using styles data
    const stitchingPrice = calculateStitchingPrice(data.styleOptions);
    const stylePrice = calculateStylePrice(data.styleOptions);
    const fabricPrice = calculateFabricPrice(data.fabricSelections);

    // Update order form with calculated prices
    OrderForm.setValue("charges.fabric", fabricPrice);
    OrderForm.setValue("charges.stitching", stitchingPrice);
    OrderForm.setValue("charges.style", stylePrice);
  };

  // ============================================================================
  // SHELVES FORM HANDLERS
  // ============================================================================
  const handleShelvesProceed = () => {
    handleProceed(3);
  };

  // ============================================================================
  // ORDER & PAYMENT HANDLERS
  // ============================================================================
  const handleOrderFormSubmit = (data: Partial<OrderSchema>) => {
    setOrder(data);
  };

  const handleOrderFormProceed = () => {
    handleProceed(4);
  };

  // ============================================================================
  // ORDER CONFIRMATION & CANCELLATION
  // ============================================================================
  const validateOrderCompletion = () => {
    if (savedSteps.length !== steps.length - 1) {
      toast.error("Complete all the steps to confirm order!!");
      return false;
    }

    const address = demographicsForm.getValues().address ?? {};

    const requiredFields: (keyof typeof address)[] = [
      "city",
      "area",
      "block",
      "street",
      "houseNumber",
    ];

    const isAddressDefined = requiredFields.every(
      (key) => typeof address[key] === "string" && address[key]!.trim() !== ""
    );

    if (OrderForm.getValues().orderType === "homeDelivery" && !isAddressDefined) {
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
      numOfFabrics: fabricSelectionForm.getValues()?.fabricSelections?.length ?? undefined,
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

    const fabricSelectionsData = fabricSelectionForm.getValues().fabricSelections;
    if (fabricSelectionsData && fabricSelectionsData.length > 0) {
      updateFabricStockMutation.mutate({
        fabricSelections: fabricSelectionsData,
        fabricsData: fabricsResponse?.data || [],
      });
    }

    handleProceed(5);
  };

  const handleOrderCancellation = () => {
    const formOrder: Partial<OrderSchema> = {
      ...OrderForm.getValues(),
      ...paymentForm.getValues(),
      orderDate: new Date().toISOString(),
      orderStatus: "Cancelled",
      numOfFabrics: fabricSelectionForm.getValues()?.fabricSelections?.length ?? undefined,
    };

    OrderForm.setValue("orderStatus", "Cancelled");
    setOrder(formOrder);

    if (orderId) {
      updateOrderMutation.mutate({
        fields: formOrder,
        orderId: orderId,
        onSuccessAction: "cancelled",
      });
    }
  };

  // ============================================================================
  // SIDE EFFECTS
  // ============================================================================
  // Sync shelf amount to order charges
  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", totalShelveAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalShelveAmount]);

  // Reset measurements when customer changes
  React.useEffect(() => {
    measurementsForm.reset(customerMeasurementsDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerDemographics.id]);

  // Prompt for order creation on mount
  React.useEffect(() => {
    if (!orderId) {
      openDialog(
        "Create New Work Order",
        "Do you want to create a new work order?",
        () => {
          createOrderMutation.mutate();
          closeDialog();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      demographicsForm.reset();
      resetWorkOrder();
    };
  }, []);

  // ============================================================================
  // RENDER: NO ORDER STATE
  // ============================================================================
  if (!orderId) {
    return (
      <OrderCreationPrompt
        orderType="Work Order"
        isPending={createOrderMutation.isPending}
        onCreateOrder={() => {
          openDialog(
            "Create New Work Order",
            "Do you want to create a new work order? This will initialize a new order entry.",
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
      <div className="sticky top-0 z-20">
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
          orderType="Work Order"
          deliveryType={order.orderType}
          paymentType={order.paymentType}
          numOfFabrics={order.numOfFabrics}
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
            onEdit={() => removeSavedStep(0)}
            onCancel={() => addSavedStep(0)}
            onProceed={handleDemographicsProceed}
            onClear={() => removeSavedStep(0)}
          />
        </div>

        {/* STEP 1: Measurements */}
        <div
          id={steps[1].id}
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ErrorBoundary fallback={<div>Customer Measurements crashed</div>}>
            <CustomerMeasurementsForm
              form={measurementsForm}
              isOrderClosed={isOrderClosed}
              customerId={customerDemographics.id?.toString() || null}
              customerRecordId={customerDemographics.customerRecordId}
              onProceed={handleMeasurementsProceed}
            />
          </ErrorBoundary>
        </div>

        {/* STEP 2: Fabric Selection */}
        <div
          id={steps[2].id}
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ErrorBoundary fallback={<div>Fabric Selection crashed</div>}>
            <FabricSelectionForm
              customerId={customerDemographics.id?.toString() || null}
              form={fabricSelectionForm}
              isOrderClosed={isOrderClosed}
              onSubmit={handleFabricSelectionSubmit}
              onProceed={() => handleProceed(2)}
              orderId={order.orderID || null}
              orderRecordId={orderId}
              onCampaignsChange={(campaigns) => {
                if (orderId) {
                  OrderForm.setValue("campaigns", campaigns);
                }
              }}
              isProceedDisabled={fabricSelections.length === 0}
            />
          </ErrorBoundary>
        </div>

        {/* STEP 3: Shelved Products */}
        <div
          id={steps[3].id}
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ErrorBoundary fallback={<div>Shelved Products crashed</div>}>
            <ShelvedProductsForm
              form={ShelvesForm}
              isOrderClosed={isOrderClosed}
              onProceed={handleShelvesProceed}
            />
          </ErrorBoundary>
        </div>

        {/* STEP 4: Order & Payment Info */}
        <div
          id={steps[4].id}
          ref={(el) => {
            sectionRefs.current[4] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ErrorBoundary fallback={<div>Order and Payment crashed</div>}>
            <OrderTypeAndPaymentForm
              form={OrderForm}
              onSubmit={handleOrderFormSubmit}
              onProceed={handleOrderFormProceed}
              customerAddress={customerDemographics?.address}
              fabricSelections={fabricSelections}
            />
          </ErrorBoundary>
        </div>

        {/* STEP 5: Confirmation */}
        <div
          id={steps[5].id}
          ref={(el) => {
            sectionRefs.current[5] = el;
          }}
          className="w-full flex flex-col items-center"
        >
          <ErrorBoundary fallback={<div>Payment crashed</div>}>
            <PaymentTypeForm
              form={paymentForm}
              isOrderClosed={isOrderClosed}
              onConfirm={() => {
                openDialog(
                  "Confirm new work order",
                  "Do you want to confirm a new work order?",
                  () => {
                    handleOrderConfirmation();
                    closeDialog();
                  }
                );
              }}
              onCancel={() => {
                openDialog(
                  "Cancel new work order",
                  "Do you want to cancel a new work order?",
                  () => {
                    handleOrderCancellation();
                    closeDialog();
                  }
                );
              }}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
