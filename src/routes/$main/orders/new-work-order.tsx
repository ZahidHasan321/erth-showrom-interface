import * as React from "react";
import {createFileRoute} from "@tanstack/react-router";
import {CustomerDemographicsForm} from "@/components/forms/customer-demographics";
import {CustomerMeasurementsForm} from "@/components/forms/customer-measurements";
import {Stepper} from "@/components/ui/stepper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {customerDemographicsSchema} from "@/components/forms/customer-demographics/schema";
import {customerMeasurementsSchema} from "@/components/forms/customer-measurements/schema";
import {useCurrentWorkOrderStore} from "@/store/current-work-order";
import {z} from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/$main/orders/new-work-order")({
  component: NewWorkOrder,
});

function NewWorkOrder() {
  const {
    currentStep,
    setCurrentStep,
    customerDemographics,
    customerMeasurements,
    savedSteps,
  } = useCurrentWorkOrderStore();


  const demographicsForm = useForm<z.infer<typeof customerDemographicsSchema>>({
    resolver: zodResolver(customerDemographicsSchema),
    defaultValues: {
      ...customerDemographics,
      customerType: "New",
    },
  });

  const measurementsForm = useForm<z.infer<typeof customerMeasurementsSchema>>({
    resolver: zodResolver(customerMeasurementsSchema),
    defaultValues: customerMeasurements,
  });

  const steps = [{ title: "Customer Demographics" }, { title: "Customer Measurement" },
    {title: "Fabric Selection"}, {title: "Shelves Products"},  {title: "Order & Payment Info"}, {title: "Confirmation"} ];

  /**
   * Function to determine if navigation to a target step is allowed
   * @param from - The current step
   * @param to - The target step to navigate to
   * @returns boolean indicating if navigation is allowed
   */
  const canNavigateToStep = React.useCallback((from: number, to: number) => {
    if (to <= from) {
      return true;
    }

    // Ensure all intermediate steps are saved
    for (let step = from; step < to; step++) {
      if (!savedSteps.includes(step)) {
        setCurrentStep(step);
        toast.error("Please complete the current step before proceeding.");
        return false;
      }
    }

    return true;
  }, [savedSteps]);

  // completed steps are the saved steps that are less than the current step(for example, if current step is 2, and saved steps are [0,1,3], 
  // then completed steps will be [0,1]), for ui mainly.
  const completedSteps = React.useMemo(() => savedSteps.filter((step) => step < currentStep), [savedSteps, currentStep]);

  return (
    <div className={"flex flex-col gap-6 max-w-5xl"}>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        canNavigateToStep={canNavigateToStep}
        onStepChange={(step) => {
          if (canNavigateToStep(currentStep, step)) {
            setCurrentStep(step);
          }
        }}
      />
      {currentStep === 0 && <CustomerDemographicsForm form={demographicsForm} />}
      {currentStep === 1 && <CustomerMeasurementsForm form={measurementsForm} />}
    </div>
  );
}
