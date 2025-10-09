import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { customerMeasurementsSchema, customerMeasurementsDefaults } from "@/components/forms/customer-measurements/schema";
import { customerDemographicsDefaults } from "@/components/forms/customer-demographics/schema";
import { createWorkOrderStore } from "@/store/current-work-order";
import { z } from "zod";
import { toast } from "sonner";
import { FabricSelectionForm } from "@/components/forms/fabric-selection-and-options";
import { ShelvedProductsForm } from "@/components/forms/shelved-products";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import { HorizontalStepper } from "@/components/ui/horizontal-stepper";


export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
  head: () => ({
    meta: [{
      title: "New Work Order",
    }]
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
  const useCurrentWorkOrderStore = React.useMemo(() => createWorkOrderStore(main), [main]);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const {
    currentStep,
    setCurrentStep,
    savedSteps,
    resetWorkOrder,
    addSavedStep,
    removeSavedStep,
    customerId,
    setCustomerId,  
    setCustomerDemographics,
    setCustomerMeasurements,
    setShelvedProducts,
  } = useCurrentWorkOrderStore();



  // Forms
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: customerDemographicsDefaults
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

  React.useEffect(() => {
    if(customerId == null) resetWorkOrder;
  },[customerId])

  React.useEffect(() => {
    if (activeSection) {
      const nextStep = steps.findIndex(step => step.id === activeSection);
      if (nextStep !== -1 && nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [activeSection, currentStep, setCurrentStep, steps]);

  const completedSteps = savedSteps;

  const handleStepChange = (i: number) => {
    const element = document.getElementById(steps[i].id);
    if (element) {
      setIsScrolling(true);
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    }
  };

  const handleProceed = React.useCallback((step: number) => {
    addSavedStep(step);
  }, [addSavedStep]);

  return (
    <div className={`flex flex-col xl:gap-8 ${isScrolling ? 'pointer-events-none' : ''}`}>
      <div className="sticky w-full top-0 z-10 bg-white dark:bg-gray-950 shadow-md">
        <HorizontalStepper
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepChange={handleStepChange}
        />
      </div>

      {/* Right Side Content */}
      <div className="flex flex-col flex-1 items-center space-y-20 p-4 xl:p-0">
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
                onProceed={() => handleProceed(0)}
              />
            )}
            {index === 1 && (
              <CustomerMeasurementsForm
                form={measurementsForm}
                onSubmit={(data) => {
                  setCustomerMeasurements(data);
                  toast.success("Customer Measurements saved ✅");
                }}
                customerId={customerId}
                onMeasurementsChange={(measurements) => {
                  if (measurements && Object.keys(measurements).length > 0) {
                    addSavedStep(1);
                  } else {
                    removeSavedStep(1);
                  }
                }}
                onProceed={() => handleProceed(1)}
              />
            )}
            {
              index == 2 && <FabricSelectionForm useCurrentWorkOrderStore={useCurrentWorkOrderStore} customerId={customerId} />
            }
            {
              index == 3 && <ShelvedProductsForm setFormData={setShelvedProducts} onProceed={() => handleProceed(3)} />
            }
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
