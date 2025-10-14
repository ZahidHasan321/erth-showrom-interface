"use client";

import { createOrder } from "@/api/orders";
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
import {
  orderTypeAndPaymentDefaults,
  OrderTypeAndPaymentForm,
  orderTypeAndPaymentSchema,
} from "@/components/forms/order-type-and-payment";
import { paymentTypeSchema } from "@/components/forms/payment-type";
import { PaymentTypeForm } from "@/components/forms/payment-type/payment-type-form";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import HorizontalStepper from "@/components/ui/horizontal-stepper";
import { mapApiOrderToFormOrder } from "@/lib/order-mapper";
import { createWorkOrderStore } from "@/store/current-work-order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useForm } from "react-hook-form";
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
  // confirmation dialog
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  // store selectors
  const currentStep = useCurrentWorkOrderStore((s) => s.currentStep);
  const setCurrentStep = useCurrentWorkOrderStore((s) => s.setCurrentStep);
  const savedSteps = useCurrentWorkOrderStore((s) => s.savedSteps);
  const addSavedStep = useCurrentWorkOrderStore((s) => s.addSavedStep);
  const removeSavedStep = useCurrentWorkOrderStore((s) => s.removeSavedStep);
  const customerId = useCurrentWorkOrderStore((s) => s.customerId);
  const setCustomerId = useCurrentWorkOrderStore((s) => s.setCustomerId);
  const customerRecordId = useCurrentWorkOrderStore((s) => s.customerRecordId);
  const setCustomerRecordId = useCurrentWorkOrderStore((s) => s.setCustomerRecordId);
  const setFabricSelections = useCurrentWorkOrderStore((s) => s.setFabricSelections);
  const setStyleOptions = useCurrentWorkOrderStore((s) => s.setStyleOptions);
  const setShelvedProducts = useCurrentWorkOrderStore((s) => s.setShelvedProducts);
  const shelvedProducts = useCurrentWorkOrderStore((s) => s.shelvedProducts);
  const orderId = useCurrentWorkOrderStore((s) => s.orderId);
  const setOrderId = useCurrentWorkOrderStore((s) => s.setOrderId);
  const order = useCurrentWorkOrderStore((s) => s.order);
  const setOrder = useCurrentWorkOrderStore((s) => s.setOrder);

  // mutation to create order
  const { mutate: createNewOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ fields: { OrderStatus: "Pending" } }),
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data;
        const formattedOrder = mapApiOrderToFormOrder(order);
        setOrderId(order.id);
        setOrder(formattedOrder);
        toast.success("New work order created successfully!");
      }
    },
    onError: () => {
      toast.error("Failed to create new work order.");
    },
  });

  // forms
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

  const OrderForm = useForm<z.infer<typeof orderTypeAndPaymentSchema>>({
    resolver: zodResolver(orderTypeAndPaymentSchema),
    defaultValues: orderTypeAndPaymentDefaults,
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: { paymentType: "cash" },
  });

  // charges
  const shelfCharges =
    shelvedProducts && shelvedProducts.length > 0
      ? shelvedProducts.reduce((total, product) => total + product.quantity * product.unitPrice, 0)
      : 0;

  const fabricCharges = 100;
  const stitchingCharges = 20;
  const advancePayment = fabricCharges + shelfCharges + 0.5 * stitchingCharges;

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", shelfCharges);
    OrderForm.setValue("charges.fabric", fabricCharges);
    OrderForm.setValue("charges.stitching", stitchingCharges);
    OrderForm.setValue("charges.style", 0);
    OrderForm.setValue("advance", advancePayment);
  }, [shelfCharges, fabricCharges, stitchingCharges, advancePayment, OrderForm]);

  // ----------------------------
  // stable refs for sections
  // ----------------------------
  const sectionRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  // ensure array length
  React.useEffect(() => {
    sectionRefs.current = steps.map((_, i) => sectionRefs.current[i] ?? null);
  }, []);

  // ----------------------------
  // scroll tracking (rAF-throttled)
  // ----------------------------
  React.useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      // compute centers for each section
      const centers = steps.map((_, i) => {
        const el = sectionRefs.current[i];
        if (!el) return Number.POSITIVE_INFINITY;
        const rect = el.getBoundingClientRect();
        // absolute center relative to document
        const topAbs = window.scrollY + rect.top;
        return topAbs + rect.height / 2;
      });

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      // find nearest center
      let nearest = 0;
      let minDist = Infinity;
      centers.forEach((c, idx) => {
        const d = Math.abs(viewportCenter - c);
        if (d < minDist) {
          minDist = d;
          nearest = idx;
        }
      });

      setCurrentStep(nearest);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => updateActive());
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once on mount
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [setCurrentStep]);

  // completed steps
  const completedSteps = savedSteps;

  // scroll to step when clicked
  const handleStepChange = (i: number) => {
    const el = sectionRefs.current[i];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleProceed = (step: number) => addSavedStep(step);

  const handleFabricSelectionSubmit = (data: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }) => {
    setFabricSelections(data.fabricSelections);
    setStyleOptions(data.styleOptions);
    toast.success("Fabric Selections and Style Options saved ✅");
  };

  React.useEffect(() => {
    if (!orderId) {
      setConfirmationDialog({
        isOpen: true,
        title: "Create New Work Order",
        description: "Do you want to create a new work order?",
        onConfirm: () => {
          createNewOrder();
          setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  }, [orderId, createNewOrder]);

  // If not created yet
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
        <p className="text-gray-600 dark:text-gray-400">You need to create a new work order before proceeding.</p>

        <Button
          size="lg"
          onClick={() =>
            setConfirmationDialog({
              isOpen: true,
              title: "Create New Work Order",
              description: "Do you want to create a new work order? This will initialize a new order entry.",
              onConfirm: () => {
                createNewOrder();
                setConfirmationDialog((prev) => ({ ...prev, isOpen: false }));
              },
            })
          }
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create New Work Order"}
        </Button>

        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
      </div>
    );
  }

  // ----------------------------
  // MAIN RENDER
  // ----------------------------
  return (
    <div className="mb-56">
      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationDialog.onConfirm}
        title={confirmationDialog.title}
        description={confirmationDialog.description}
      />

      {/* Stepper (sticky) */}
      <HorizontalStepper steps={steps} completedSteps={completedSteps} currentStep={currentStep} onStepChange={handleStepChange} />

      {/* Make space so sticky header does not overlap content */}
      <div className="pt-10" />

      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-20 p-4 xl:p-0">
        {/* After the sticky stepper */}
        <div className="border-b border-border rounded-lg shadow-lg bg-muted/40 py-3 px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Work Order #{order.OrderID}
            </h2>
            <p className="text-lg text-muted-foreground">
              Status: <span className="font-medium text-green-600">{order.OrderStatus ?? "Pending"}</span>
            </p>
          </div>
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="w-full flex flex-col items-center max-w-7xl"
          >
            {/* Render the appropriate form for each step */}
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSubmit={() => toast.success("Customer Demographics saved ✅")}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onCustomerRecordChange={setCustomerRecordId}
                onCustomerIdChange={setCustomerId}
                onProceed={() => {
                  if (orderId && customerRecordId) {
                    setOrder({ CustomerID: [customerRecordId] });
                    handleProceed(0);
                  }
                }}
                onClear={() => removeSavedStep(0)}
                customerId={customerId}
                customerRecordId={customerRecordId}
              />
            )}

            {index === 1 && (
              <CustomerMeasurementsForm form={measurementsForm} onSubmit={() => toast.success("Customer Measurements saved ✅")} customerId={customerId} onProceed={() => handleProceed(1)} />
            )}

            {index === 2 && (
              <FabricSelectionForm customerId={customerId} form={fabricSelectionForm} onSubmit={handleFabricSelectionSubmit} onProceed={() => handleProceed(2)} orderId={order?.OrderID ?? null} />
            )}

            {index === 3 && <ShelvedProductsForm setFormData={setShelvedProducts} onProceed={() => handleProceed(3)} />}

            {index === 4 && (
              <OrderTypeAndPaymentForm
                form={OrderForm}
                onSubmit={(data) => {
                  setOrder(data);
                  toast.success("Order & Payment Info saved ✅");
                }}
                onProceed={() => handleProceed(4)}
              />
            )}

            {index === 5 && (
              <PaymentTypeForm
                form={paymentForm}
                onSubmit={() => {
                  const currentStore = useCurrentWorkOrderStore.getState();
                  console.log("🧾 Full Work Order Store:", currentStore);
                  toast.success("Payment confirmed! ✅");
                  handleProceed(5);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
