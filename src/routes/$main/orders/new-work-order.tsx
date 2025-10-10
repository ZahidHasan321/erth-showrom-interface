import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerDemographicsSchema,
  customerDemographicsDefaults,
} from "@/components/forms/customer-demographics/schema";
import {
  customerMeasurementsSchema,
  customerMeasurementsDefaults,
} from "@/components/forms/customer-measurements/schema";
import { createWorkOrderStore } from "@/store/current-work-order";
import { z } from "zod";
import { toast } from "sonner";
import { FabricSelectionForm } from "@/components/forms/fabric-selection-and-options";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";
import { createOrder } from "@/api/orders";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { type Order } from "@/types/order";

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

  const [askedToCreateOrder, setAskedToCreateOrder] = React.useState(false);

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
    customerDemographics,
    setCustomerDemographics,
    setCustomerMeasurements,
    setShelvedProducts,
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
        setOrderId(order.id);
        setOrder(order.fields);
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

  // Refs for scroll sections
  const sectionRefs = steps.map(() => React.useRef<HTMLDivElement | null>(null));
  const activeSection = useScrollSpy(sectionRefs, {
    rootMargin: "0px",
    threshold: 0.5,
  });

  // React.useEffect(() => {
  //   if (customerId == null) resetWorkOrder();
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

  // -------------------------------------------------
  // Auto-prompt user on first mount if no order exists
  // -------------------------------------------------
  React.useEffect(() => {
    if (!orderId && !askedToCreateOrder) {
      setAskedToCreateOrder(true);
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
  }, [orderId, askedToCreateOrder, createNewOrder]);

  // -------------------------------------------------
  // Render states
  // -------------------------------------------------

  // While we haven't asked yet
  if (!orderId && !askedToCreateOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Preparing new work order...</p>
      </div>
    );
  }

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

  function onHandleProceed(customerId: string|null, orderId:string|null){
    if(orderId && customerId){
      setOrder({CustomerID:[customerId]})
      addSavedStep(0);
    }
  }
  
  return (
    <div
      className={``}
    >
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
      <p>
        Order ID: {order.OrderID}
      </p>
        {steps.map((step, index) => (
          <div key={step.id} id={step.id} ref={sectionRefs[index]}>
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSubmit={(data) => {
                  setCustomerDemographics(data);
                  toast.success("Customer Demographics saved ✅");
                }}
                onEdit={() => removeSavedStep(0)}
                onCancel={() => addSavedStep(0)}
                onCustomerChange={setCustomerId}
                onProceed={() => onHandleProceed(customerId, orderId)}

              />
            )}

            {index === 1 && (
              <CustomerMeasurementsForm
                form={measurementsForm}
                onSubmit={(data) => {
                  setCustomerMeasurements(data);
                  toast.success("Customer Measurements saved ✅");
                }}
                customerId={customerDemographics.id??null}
                onProceed={() => handleProceed(1)}
              />
            )}

            {index === 2 && (
              <FabricSelectionForm
                useCurrentWorkOrderStore={useCurrentWorkOrderStore}
                customerId={customerId}
              />
            )}

            {index === 3 && (
              <ShelvedProductsForm
                setFormData={setShelvedProducts}
                onProceed={() => handleProceed(3)}
              />
            )}

            {index > 3 && (
              <div className="min-h-screen flex items-center justify-center">
                <div className="p-6 border rounded-lg w-full text-center">
                  {step.title} Form
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
