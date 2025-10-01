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
import { useCurrentWorkOrderStore } from "@/store/current-work-order";
import { z } from "zod";
import { VerticalStepper } from "@/components/ui/vertical-stepper";
import { toast } from "sonner";

export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
});

function NewWorkOrder() {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const {
    currentStep,
    setCurrentStep,
    savedSteps,
    addSavedStep,
    setCustomerDemographics,
    setCustomerMeasurements
  } = useCurrentWorkOrderStore();

  // Forms
  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: {
      ...customerDemographicsDefaults,
      customerType: "New",
    },
  });

  const measurementsForm = useForm<z.infer<typeof customerMeasurementsSchema>>({
    resolver: zodResolver(customerMeasurementsSchema),
    defaultValues: customerMeasurementsDefaults,
  });

  // Stepper items
  const steps = [
    { title: "Customer Demographics" },
    { title: "Customer Measurement" },
    { title: "Fabric Selection" },
    { title: "Shelves Products" },
    { title: "Order & Payment Info" },
    { title: "Confirmation" },
  ];

  // Refs for scroll sections
  const sectionRefs = steps.map(() => React.useRef<HTMLDivElement | null>(null));
  const currentStepRef = React.useRef<number>(currentStep);
  // IntersectionObserver for active step
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          let maxRatio = -1;
          let nextStep = -1;

          entries.forEach((entry) => {
            if (entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              nextStep = sectionRefs.findIndex(
                (ref) => ref.current === entry.target
              );
            }
          });

          if (nextStep !== -1 && nextStep !== currentStepRef.current) {
            currentStepRef.current = nextStep;
            setCurrentStep(nextStep);
          }
        }, 100); // Debounce time in ms
      },
      {
        root: null,
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, [sectionRefs, setCurrentStep]);

  const completedSteps = savedSteps;

  return (
    <div className="flex gap-8 max-w-6xl">
      {/* Left Sidebar Stepper with scroll */}
      <div className="w-64 sticky top-10 self-start">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <VerticalStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepChange={(i) =>
              sectionRefs[i].current?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1 space-y-20">
        {/* Step 0: Demographics */}
        <div ref={sectionRefs[0]}>
          <CustomerDemographicsForm
            form={demographicsForm}
            onSubmit={(data) => {
              setCustomerDemographics(data);
              addSavedStep(0);
              toast.success("Customer Demographics saved ✅");
            }}
          />
        </div>

        {/* Step 1: Measurements */}
        <div ref={sectionRefs[1]}>
          <CustomerMeasurementsForm
            form={measurementsForm}
            onSubmit={(data) => {
              setCustomerMeasurements(data);
              addSavedStep(1);
              toast.success("Customer Measurements saved ✅");
            }}
          />
        </div>

        {/* Step 2+ placeholders */}
        <div ref={sectionRefs[2]} className="min-h-screen flex items-center justify-center">
          <div className="p-6 border rounded-lg w-full text-center">
            Fabric Selection Form
          </div>
        </div>
        <div ref={sectionRefs[3]} className="min-h-screen flex items-center justify-center">
          <div className="p-6 border rounded-lg w-full text-center">
            Shelves Products Form
          </div>
        </div>
        <div ref={sectionRefs[4]} className="min-h-screen flex items-center justify-center">
          <div className="p-6 border rounded-lg w-full text-center">
            Order & Payment Info Form
          </div>
        </div>
        <div ref={sectionRefs[5]} className="min-h-screen flex items-center justify-center">
          <div className="p-6 border rounded-lg w-full text-center">
            Confirmation Page
          </div>
        </div>
      </div>
    </div>
  );
}