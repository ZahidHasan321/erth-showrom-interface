import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerDemographicsSchema } from "@/components/forms/customer-demographics/schema";
import { customerMeasurementsSchema } from "@/components/forms/customer-measurements/schema";
import { customerDemographicsDefaults } from "@/components/forms/customer-demographics/schema";
import { customerMeasurementsDefaults } from "@/components/forms/customer-measurements/schema";
import { createWorkOrderStore } from "@/store/current-work-order";
import { z } from "zod";
import { toast } from "sonner";
import { useScrollSpy } from "@/hooks/use-scrollspy";
import { Stepper } from "@/components/ui/stepper";
import { FabricSelectionForm } from "@/components/forms/fabric-selection-and-options";

export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
});

const steps = [
  { title: "Customer Demographics", id: "step-0" },
  { title: "Customer Measurement", id: "step-1" },
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
    addSavedStep,
    removeSavedStep,
    setCustomerDemographics,
    setCustomerMeasurements
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
    if (activeSection) {
      const nextStep = steps.findIndex(step => step.id === activeSection);
      if (nextStep !== -1 && nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [activeSection, currentStep, setCurrentStep, steps]);

  const completedSteps = savedSteps;

  return (
    <div className={`w-full flex flex-col md:flex-row md:gap-8 md:max-w-6xl ${isScrolling ? 'pointer-events-none' : ''}`}>
      <div className="w-64 sticky top-10 self-start">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepChange={(i) => {
              const element = document.getElementById(steps[i].id);
              if (element) {
                setIsScrolling(true);
                element.scrollIntoView({ behavior: "smooth" });
                setTimeout(() => {
                  setIsScrolling(false);
                }, 200);
              }
            }}
          />
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1 space-y-20 p-4 md:p-0">
        {steps.map((step, index) => (
          <div key={step.id} id={step.id} ref={sectionRefs[index]}>
            {index === 0 && (
              <CustomerDemographicsForm
                form={demographicsForm}
                onSubmit={(data) => {
                  setCustomerDemographics(data);
                  toast.success("Customer Demographics saved ✅");
                }}
                addSavedStep={addSavedStep}
                removeSavedStep={removeSavedStep}
              />
            )}
            {index === 1 && (
              <CustomerMeasurementsForm
                form={measurementsForm}
                onSubmit={(data) => {
                  setCustomerMeasurements(data);
                  addSavedStep(1);
                  toast.success("Customer Measurements saved ✅");
                }}
              />
            )}
            {
              index == 2 && <FabricSelectionForm />
            }
            {index > 2 && (
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
