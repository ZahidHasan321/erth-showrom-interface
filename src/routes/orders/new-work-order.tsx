import { createFileRoute } from "@tanstack/react-router";
import { CustomerDemographicsForm } from "@/components/forms/customer-demographics";
import { CustomerMeasurementsForm } from "@/components/forms/customer-measurements";

export const Route = createFileRoute("/orders/new-work-order")({
  component: NewWorkOrder,
});

function NewWorkOrder() {
  return (
    <div className={"flex flex-col gap-6 max-w-5xl"}>
      <CustomerDemographicsForm />
      <div className="border-b min-w-screen" />
      <CustomerMeasurementsForm />
    </div>
  );
}
