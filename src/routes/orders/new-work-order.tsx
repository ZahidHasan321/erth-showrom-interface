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

export const Route = createFileRoute("/orders/new-work-order")({
  component: NewWorkOrder,
});

function NewWorkOrder() {
  const {
    currentStep,
    setCurrentStep,
    customerDemographics,
    customerMeasurements,
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

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 0) {
      isValid = await demographicsForm.trigger();
    } else if (currentStep === 1) {
      isValid = await measurementsForm.trigger();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className={"flex flex-col gap-6 max-w-5xl"}>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
        onStepChange={(step) => {
          if (step < currentStep) {
            handlePrevious();
          }
          else{
            handleNext();
          }
        }}
      />
      {currentStep === 0 && <CustomerDemographicsForm form={demographicsForm} />}
      {currentStep === 1 && <CustomerMeasurementsForm form={measurementsForm} />}
    </div>
  );
}
