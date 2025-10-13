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
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import { mapApiOrderToFormOrder } from "@/lib/order-mapper";
import { createWorkOrderStore } from "@/store/current-work-order";
import { type Order } from "@/types/order";
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

function NewWorkOrder() {
  const { main } = Route.useParams();
  const useCurrentWorkOrderStore = React.useMemo(
    () => createWorkOrderStore(main),
    [main]
  );

  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  const {
    currentStep,
    setCurrentStep,
    savedSteps,
    addSavedStep,
    removeSavedStep,
    customerId,
    setCustomerId,
    customerRecordId,
    setCustomerRecordId,
    setFabricSelections,
    setStyleOptions,
    setShelvedProducts,
    shelvedProducts,
    orderId,
    setOrderId,
    order,
    setOrder,
  } = useCurrentWorkOrderStore();

  const { mutate: createNewOrder, isPending } = useMutation({
    mutationFn: () => createOrder({ fields: { OrderStatus: "Pending" } }),
    onSuccess: (response) => {
      if (response.data) {
        const order = response.data as Order;
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

  // Forms
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
    defaultValues: {
      fabricSelections: [],
      styleOptions: [],
    },
  });

  const OrderForm = useForm<z.infer<typeof orderTypeAndPaymentSchema>>({
    resolver: zodResolver(orderTypeAndPaymentSchema),
    defaultValues: orderTypeAndPaymentDefaults,
  });

  const paymentForm = useForm<z.infer<typeof paymentTypeSchema>>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      paymentType: "cash",
    },
  });

  const shelfCharges = React.useMemo(() => {
    if (!shelvedProducts || shelvedProducts.length === 0) {
      return 0;
    }
    return shelvedProducts.reduce((total, product) => {
      return total + product.quantity * product.unitPrice;
    }, 0);
  }, [shelvedProducts]);

  // Dummy values for now
  const fabricCharges = 100;
  const stitchingCharges = 20;

  const advancePayment = React.useMemo(() => {
    return fabricCharges + shelfCharges + (0.5 * stitchingCharges);
  }, [fabricCharges, shelfCharges, stitchingCharges]);

  React.useEffect(() => {
    OrderForm.setValue("charges.shelf", shelfCharges);
    OrderForm.setValue("charges.fabric", fabricCharges);
    OrderForm.setValue("charges.stitching", stitchingCharges);
    OrderForm.setValue("charges.style", 0); // Keep style as 0
    OrderForm.setValue("advance", advancePayment);
  }, [
    shelfCharges,
    fabricCharges,
    stitchingCharges,
    advancePayment,
    OrderForm,
  ]);
  // Refs for scroll sections
  const sectionRefs = steps.map(() =>
    React.useRef<HTMLDivElement | null>(null)
  );
  const activeSection = useScrollSpy(sectionRefs, {
    rootMargin: "0px",
    threshold: 0.3,
  });

  // React.useEffect(() => {
  //   if (!customerId) { resetWorkOrder(); }
  // }, [customerId]);

  React.useEffect(() => {
    if (activeSection) {
      const nextStep = steps.findIndex((step) => step.id === activeSection);
      if (nextStep !== -1 && nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [activeSection, currentStep, setCurrentStep]);

  const completedSteps = savedSteps;

  const handleStepChange = (i: number) => {
    const element = document.getElementById(steps[i].id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceed = React.useCallback(
    (step: number) => {
      addSavedStep(step);
    },
    [addSavedStep]
  );

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

  // If asked but no order created (user canceled)
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <h2 className="text-2xl font-semibold">No order created yet 📝</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You need to create a new work order before proceeding.
        </p>

        <Button
          size="lg"
          onClick={() =>
            setConfirmationDialog({
              isOpen: true,
              title: "Create New Work Order",
              description:
                "Do you want to create a new work order? This will initialize a new order entry.",
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

  // -------------------------------------------------
  // MAIN CONTENT (only shown after orderId is set)
  // -------------------------------------------------




  return (
    <div className="mb-20">
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
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepChange={handleStepChange}
        />
      </div>
      {/* Step Content */}
      <div className="flex flex-col flex-1 items-center space-y-20 p-4 xl:p-0">
        <p>Order ID: {order.OrderID}</p>
        {steps.map((step, index) => (
          <div
            key={step.id}
            id={step.id}
            className="w-full flex flex-col items-center max-w-7xl"
            ref={sectionRefs[index]}
          >
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSubmit={() => {
                  toast.success("Customer Demographics saved ✅");
                }}
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
                onClear={() => {
                  removeSavedStep(0)
                }}
                customerId={customerId}
                customerRecordId={customerRecordId}
              />
            )}

            {index === 1 && (
              <CustomerMeasurementsForm
                form={measurementsForm}
                onSubmit={() => {
                  toast.success("Customer Measurements saved ✅");
                }}
                customerId={customerId}
                onProceed={() => handleProceed(1)}
              />
            )}
            {index === 2 && (
              <FabricSelectionForm
                customerId={customerId}
                form={fabricSelectionForm}
                onSubmit={handleFabricSelectionSubmit}
                onProceed={() => handleProceed(2)}
                orderId={order?.OrderID ?? null}
              />
            )}

            {index === 3 && (
              <ShelvedProductsForm
                setFormData={setShelvedProducts}
                onProceed={() => handleProceed(3)}
              />
            )}
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
                  // Print the entire current work order store
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
