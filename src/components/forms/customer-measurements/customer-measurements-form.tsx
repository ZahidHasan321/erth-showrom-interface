import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerMeasurementsDefaults, customerMeasurementsSchema, type CustomerMeasurementsSchema } from "./schema";
import MyImg from "../../../assets/image.png";
import * as React from "react";
import { MeasurementInput } from "./MeasurementInput";
import { GroupedMeasurementFields } from "./GroupedMeasurementFields";
import { FabricReferenceInput } from "./FabricReferenceInput";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { upsertMeasurement } from "@/api/measurements";

import { useQuery } from "@tanstack/react-query";
import { getMeasurementsByCustomerId } from "@/api/measurements";
import { LoadingSpinner } from "@/components/global/loading-spinner";
import { mapFormValuesToMeasurement, mapMeasurementToFormValues } from "@/lib/measurement-mapper";

const unit = "cm";

interface CustomerMeasurementsFormProps {
  form: UseFormReturn<z.infer<typeof customerMeasurementsSchema>>;
  onSubmit: (values: z.infer<typeof customerMeasurementsSchema>) => void;  // <-- Accept `onSubmit` as prop
  customerId: string | null;
  onMeasurementsChange?: (measurements: measurementMap | null) => void;
}

type measurementMap = Record<string, CustomerMeasurementsSchema>

export function CustomerMeasurementsForm({ form, onSubmit, customerId, onMeasurementsChange }: CustomerMeasurementsFormProps) {
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [measurements, setMeasurements] = React.useState<measurementMap | null>(null)

  React.useEffect(() => {
    onMeasurementsChange?.(measurements);
  }, [measurements, onMeasurementsChange]);
  const [selectedMeasurementId, setSelectedMeasurementId] = React.useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [previousMeasurementId, setPreviousMeasurementId] = React.useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  const { data: measurementQuery, isLoading, isError } = useQuery({
    queryKey: ["measurements", customerId],
    queryFn: () => {
      if (!customerId) {
        return Promise.resolve(null);
      }
      return getMeasurementsByCustomerId(customerId);
    },
    enabled: !!customerId,
  });

  React.useEffect(() => {
    if (!isInitialLoad) {
      if (selectedMeasurementId && measurements) {
        const selectedMeasurement = measurements[selectedMeasurementId];
        if (selectedMeasurement) {
          form.reset(selectedMeasurement);
          setIsDisabled(true);
        }
      }
    }
  }, [selectedMeasurementId, measurements, form, isInitialLoad]);

  React.useEffect(() => {
    if (measurementQuery?.data && measurementQuery.data.length > 0) {
      const newMeasurements = measurementQuery.data.reduce(
        (acc, measurement) => {
          acc.measurementMap[measurement.fields.MeasurementID] = mapMeasurementToFormValues(measurement);
          acc.measurementIDs.push(measurement.fields.MeasurementID);
          return acc;
        },
        { measurementMap: {} as measurementMap, measurementIDs: [] as string[] }
      );
      setMeasurements(newMeasurements.measurementMap);

      if (newMeasurements.measurementIDs.length > 0) {
        const firstMeasurementId = newMeasurements.measurementIDs[0];
        setSelectedMeasurementId(firstMeasurementId);
        form.setValue("measurementID", firstMeasurementId);
        setIsInitialLoad(false);
      }
    } else if (measurementQuery?.data?.length === 0) {
      // No measurements found, initialize a new form
      form.reset(customerMeasurementsDefaults);
      setIsDisabled(false);
    }
  }, [measurementQuery, customerId, setSelectedMeasurementId, form]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading measurements.</div>;
  }

  const handleSave = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Save",
      description: "Are you sure you want to save these measurements?",
      onConfirm: () => {
        form.handleSubmit(handleFormSubmit)(); // Trigger form submission with internal handler
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const handleNewMeasurement = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm New Measurement",
      description: "Are you sure you want to create a new measurement? Any unsaved changes will be lost.",
      onConfirm: () => {
        setPreviousMeasurementId(selectedMeasurementId); // Save the current measurement id
        setIsCreatingNew(true);
        setIsDisabled(false);

        const existingMeasurementIds = measurements ? Object.keys(measurements) : [];
        let nextMeasurementNumber = 1;

        if (existingMeasurementIds.length > 0) {
          const measurementNumbers = existingMeasurementIds
            .map(id => {
              const parts = id.split("-");
              return parts.length > 1 ? parseInt(parts[1], 10) : 0;
            })
            .filter(num => !isNaN(num));
          if (measurementNumbers.length > 0) {
            nextMeasurementNumber = Math.max(...measurementNumbers) + 1;
          }
        }

        const newMeasurementId = `${customerId}-${nextMeasurementNumber}`;

        let tempNewMeasurement;
        if (selectedMeasurementId && measurements) {
          const selectedMeasurement = measurements[selectedMeasurementId];
          tempNewMeasurement = { ...selectedMeasurement, measurementID: newMeasurementId };
        } else {
          tempNewMeasurement = { ...customerMeasurementsDefaults, measurementID: newMeasurementId };
        }
        setMeasurements(prev => ({
          ...prev,
          [newMeasurementId]: tempNewMeasurement,
        }));
        setSelectedMeasurementId(newMeasurementId);
        form.reset(tempNewMeasurement);
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  

  const handleEdit = () => {
    setIsDisabled(false); // Enable editing
  };


  const handleFormSubmit = async (values: z.infer<typeof customerMeasurementsSchema>) => {
    if (!customerId) {
      toast.error("Customer ID is required to save measurements.");
      return;
    }

    const measurementToUpsert = mapFormValuesToMeasurement(values, Number(customerId));

    try {
      const response = await upsertMeasurement([
        measurementToUpsert
      ]);

      if (response.status === "success" && response.data) {

        toast.success("Measurement saved successfully!");

        setIsDisabled(true);

        if (isCreatingNew) {
          setIsCreatingNew(false);
        }

        // Update the measurements state with the saved measurement
        const savedMeasurement = response.data.records[0];
        const formValues = mapMeasurementToFormValues(savedMeasurement);
        setMeasurements(prev => ({
          ...prev,
          [formValues.measurementID]: formValues,
        }));
        setSelectedMeasurementId(formValues.measurementID);

      } else {
        toast.error(response.message || "Failed to save measurement.");
      }
    } catch (error) {
      toast.error("Failed to save measurement.");
      console.error("Error upserting measurement:", error);
    }
    onSubmit(values); // Call the original onSubmit prop
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);

    // Remove the new measurement from the measurements state
    setMeasurements(prev => {
      const newMeasurements = { ...prev };
      delete newMeasurements[form.getValues("measurementID")];
      return newMeasurements;
    });

    setSelectedMeasurementId(previousMeasurementId);
    if (previousMeasurementId && measurements) {
      form.reset(measurements[previousMeasurementId]);
    } else {
      form.reset(customerMeasurementsDefaults);
    }
    setIsDisabled(true);
    toast.info("New measurement cancelled.");
  };


  

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="mx-auto space-y-8 max-w-7xl">
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
        <h1 className="text-2xl font-bold mb-4">Customer Measurement</h1>

        {/* ---- Top Controls ---- */}
        <div className="flex justify-between gap-8">
          {/* Left side: Measurement Type + ID */}
          <div className="flex gap-6 bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="measurementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                    <FormControl>
                      <SelectTrigger className="bg-white w-auto">
                        <SelectValue placeholder="Measurement Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Body">Body</SelectItem>
                      <SelectItem value="Dishdasha">Dishdasha</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="measurementID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement ID</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedMeasurementId(value);
                    }}
                    value={field.value}
                    disabled={!customerId}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white w-auto">
                        <SelectValue placeholder="Measurement ID" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {measurements && Object.keys(measurements).map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          {/* Right side: Measurement Reference */}
          <div className="bg-muted p-4 rounded-lg">
            <FormField
              control={form.control}
              name="measurementReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Reference</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isDisabled}>
                    <FormControl>
                      <SelectTrigger className="bg-white w-auto">
                        <SelectValue placeholder="Measurement Reference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Winter">Winter</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Eid">Eid</SelectItem>
                      <SelectItem value="Occasion">Occasion</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ---- Middle Section ---- */}
        <div className="flex flex-col-reverse 2xl:flex-row 2xl:gap-x-4 items-center 2xl:items-end pt-64 pb-20">
          <div className="space-y-6 flex flex-col w-80 bg-muted p-4 rounded-lg">
            <FabricReferenceInput
              form={form}
              name="fabricReferenceNo"
              label="Fabric Reference No."
              isDisabled={isDisabled}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Notes and special requests</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Customer special request and notes"
                      className="w-full bg-white border rounded-md"
                      {...field}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right: Image + Measurement Fields */}
          <div className="relative flex flex-col items-center flex-grow w-full mb-40 2xl:mb-0">
            <img src={MyImg} alt="Dishdasha Measurement Guide" className="max-w-md lg:max-w-xl 2xl:max-w-xl h-auto object-contain" />

            {/* Example: Collar Overlay */}
            <GroupedMeasurementFields
              form={form}
              title="Collar"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "collar.width", label: "Width" },
                { name: "collar.height", label: "Height" },
              ]}
              wrapperClassName="absolute top-[-23%] right-[30%] bg-muted p-2 rounded-lg"
            />
            {/* Shoulder */}
            <MeasurementInput
              form={form}
              name="shoulder"
              label="Shoulder"
              unit={unit}
              isDisabled={isDisabled}
              className="absolute top-[3%] right-[10%] bg-muted p-2 rounded-lg"
            />
            {/* Armhole */}
            <MeasurementInput
              form={form}
              name="armhole"
              label="Armhole"
              unit={unit}
              isDisabled={isDisabled}
              className="absolute top-[0%] left-[12%] bg-muted p-2 rounded-lg"
            />
            {/* Chest */}
            <GroupedMeasurementFields
              form={form}
              title="Chest"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "chest.upper", label: "Upper" },
                { name: "chest.half", label: "Half", className: "mt-2" },
                { name: "chest.full", label: "Full", className: "mt-2" }
              ]}
              wrapperClassName="absolute top-[10%] left-[6%] bg-muted p-2 rounded-lg"
            />
            {/* Sleeve */}
            <MeasurementInput
              form={form}
              name="sleeve"
              label="Sleeve"
              unit={unit}
              isDisabled={isDisabled}
              className="absolute top-[48%] left-[4%] bg-muted p-2 rounded-lg"
            />
            {/* Elbow */}
            <MeasurementInput
              form={form}
              name="elbow"
              label="Elbow"
              unit={unit}
              isDisabled={isDisabled}
              className="absolute top-[32%] left-[4%] bg-muted p-2 rounded-lg"
            />
            {/* Top Pocket */}
            <GroupedMeasurementFields
              form={form}
              title="Top Pocket"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "topPocket.length", label: "Length" },
                { name: "topPocket.width", label: "Width", className: "mt-2" },
                { name: "topPocket.distance", label: "Distance", className: "mt-2" }
              ]}
              wrapperClassName="absolute top-[10%] right-[8%] bg-muted p-2 rounded-lg"
            />
            {/* Side Pocket */}
            <GroupedMeasurementFields
              form={form}
              title="Side Pocket"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "sidePocket.length", label: "Length" },
                { name: "sidePocket.width", label: "Width", className: "mt-2" },
                { name: "sidePocket.distance", label: "Distance", className: "mt-2" },
                { name: "sidePocket.opening", label: "Opening", className: "mt-2" },
              ]}
              wrapperClassName="absolute top-[27%] right-[6%] bg-muted p-2 rounded-lg"
            />
            {/* Waist */}
            <GroupedMeasurementFields
              form={form}
              title="Waist"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "waist.front", label: "Front" },
                { name: "waist.back", label: "Back" },
              ]}
              wrapperClassName="absolute top-[49%] right-[6%] bg-muted p-2 rounded-lg"
              forceColumn={true}
            />
            {/* Length */}
            <GroupedMeasurementFields
              form={form}
              title="Length"
              unit={unit}
              isDisabled={isDisabled}
              fields={[
                { name: "length.front", label: "Front" },
                { name: "length.back", label: "Back" },
              ]}
              wrapperClassName="absolute top-[-12%] right-[13%] bg-muted p-2 rounded-lg"
            />
            {/* Bottom */}
            <MeasurementInput
              form={form}
              name="bottom"
              label="Bottom"
              unit={unit}
              isDisabled={isDisabled}
              className="absolute top-[92%] right-[6%] bg-muted p-2 rounded-lg"
            />
          </div>
        </div>

        {/* ---- Buttons ---- */}
        <div className="flex justify-center gap-6">
          {isCreatingNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelNew}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="outline"
            disabled={isDisabled}
          >
            Save Current Measurement
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleEdit}
            disabled={!selectedMeasurementId || !isDisabled} // Disable if no measurement is selected or if already editing
          >
            Edit Existing
          </Button>
          <Button
            type="button"
            onClick={handleNewMeasurement}
            disabled={!customerId || isCreatingNew}
          >
            New Measurement
          </Button>
        </div>
      </form>
    </Form>
  );
}