import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  customerMeasurementsDefaults,
  customerMeasurementsSchema,
  type CustomerMeasurementsSchema,
} from "./schema";
import * as React from "react";
import { GroupedMeasurementFields } from "./GroupedMeasurementFields";
import { FabricReferenceInput } from "./FabricReferenceInput";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "sonner";
import { upsertMeasurement } from "@/api/measurements";

import { getMeasurementsByCustomerId } from "@/api/measurements";
import { useQuery } from "@tanstack/react-query";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import {
  mapFormValuesToMeasurement,
  mapMeasurementToFormValues,
} from "@/lib/measurement-mapper";
import { type Measurement } from "@/types/customer";

const unit = "cm";

interface CustomerMeasurementsFormProps {
  form: UseFormReturn<z.infer<typeof customerMeasurementsSchema>>;
  onSubmit: (values: z.infer<typeof customerMeasurementsSchema>) => void; // <-- Accept `onSubmit` as prop
  customerId: string | null;
  onMeasurementsChange?: (measurements: measurementMap | null) => void;
  onProceed?: () => void;
}

type measurementMap = Record<string, CustomerMeasurementsSchema>;

export function CustomerMeasurementsForm({
  form,
  onSubmit,
  customerId,
  onProceed,
}: CustomerMeasurementsFormProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [measurements, setMeasurements] = React.useState<measurementMap | null>(
    null
  );
  const [selectedMeasurementId, setSelectedMeasurementId] = React.useState<
    string | null
  >(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [previousMeasurementId, setPreviousMeasurementId] = React.useState<
    string | null
  >(null);
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const { setIsLoading } = useGlobalLoader();

  React.useEffect(() => {
    setMeasurements(null);
    setSelectedMeasurementId(null);
  }, [customerId]);

  const { data: measurementQuery, isLoading } = useQuery({
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
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  React.useEffect(() => {
    if (selectedMeasurementId && measurements) {
      const selectedMeasurement = measurements[selectedMeasurementId];
      if (selectedMeasurement) {
        form.reset(selectedMeasurement);
      }
    }
  }, [selectedMeasurementId, measurements, form]);

  React.useEffect(() => {
    if (measurementQuery?.data && measurementQuery.data.length > 0) {
      const newMeasurements = measurementQuery.data.reduce(
        (
          acc: { measurementMap: measurementMap; measurementIDs: string[] },
          measurement: Measurement
        ) => {
          acc.measurementMap[measurement.fields.MeasurementID] =
            mapMeasurementToFormValues(measurement);
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
      }
    } else if (measurementQuery?.data?.length === 0) {
      // No measurements found, initialize a new form
      form.reset(customerMeasurementsDefaults);
      setIsEditing(false);
    }
  }, [measurementQuery, customerId, setSelectedMeasurementId, form]);

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
      description:
        "Are you sure you want to create a new measurement? Any unsaved changes will be lost.",
      onConfirm: () => {
        setPreviousMeasurementId(selectedMeasurementId); // Save the current measurement id
        setIsCreatingNew(true);
        setIsEditing(true);

        const existingMeasurementIds = measurements
          ? Object.keys(measurements)
          : [];
        let nextMeasurementNumber = 1;

        if (existingMeasurementIds.length > 0) {
          const measurementNumbers = existingMeasurementIds
            .map((id) => {
              const parts = id.split("-");
              return parts.length > 1 ? parseInt(parts[1], 10) : 0;
            })
            .filter((num) => !isNaN(num));
          if (measurementNumbers.length > 0) {
            nextMeasurementNumber = Math.max(...measurementNumbers) + 1;
          }
        }

        const newMeasurementId = `${customerId}-${nextMeasurementNumber}`;

        let tempNewMeasurement;
        if (selectedMeasurementId && measurements) {
          const selectedMeasurement = measurements[selectedMeasurementId];
          tempNewMeasurement = {
            ...selectedMeasurement,
            measurementID: newMeasurementId,
          };
        } else {
          tempNewMeasurement = {
            ...customerMeasurementsDefaults,
            measurementID: newMeasurementId,
          };
        }
        setMeasurements((prev) => ({
          ...prev,
          [newMeasurementId]: tempNewMeasurement,
        }));
        setSelectedMeasurementId(newMeasurementId);
        form.reset(tempNewMeasurement);
        setConfirmationDialog({ ...confirmationDialog, isOpen: false });
      },
    });
  };

  const handleCancelNew = () => {
    setIsCreatingNew(false);

    // Remove the new measurement from the measurements state
    setMeasurements((prev) => {
      const newMeasurements = { ...prev };
      delete newMeasurements[form.getValues("measurementID")];
      return newMeasurements;
    });

    setSelectedMeasurementId(previousMeasurementId);
    // if (previousMeasurementId && measurements) {
    //   form.reset(measurements[previousMeasurementId]);
    // } else {
    //   form.reset(customerMeasurementsDefaults);
    // }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedMeasurementId && measurements) {
      form.reset(measurements[selectedMeasurementId]);
    }
  };

  const handleFormSubmit = async (
    values: z.infer<typeof customerMeasurementsSchema>
  ) => {
    if (!customerId) {
      toast.error("Customer ID is required to save measurements.");
      return;
    }

    const measurementToUpsert = mapFormValuesToMeasurement(
      values,
      Number(customerId)
    );

    try {
      const response = await upsertMeasurement([measurementToUpsert]);

      if (response.status === "success" && response.data) {
        setIsEditing(false);

        if (isCreatingNew) {
          setIsCreatingNew(false);
        }

        // Update the measurements state with the saved measurement
        const savedMeasurement = response.data.records[0];
        const formValues = mapMeasurementToFormValues(savedMeasurement);
        setMeasurements((prev) => ({
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

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-8 max-w-7xl"
      >
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() =>
            setConfirmationDialog({ ...confirmationDialog, isOpen: false })
          }
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />
        <h1 className="text-2xl font-bold mb-4">Measurement</h1>

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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isEditing}
                  >
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
                      if (value != "") setSelectedMeasurementId(value);
                    }}
                    value={field.value}
                    disabled={!customerId || isCreatingNew}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white w-auto">
                        <SelectValue placeholder="Measurement ID" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {measurements &&
                        Object.keys(measurements).map((id) => (
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!isEditing}
                  >
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
        <div className="flex flex-col 2xl:flex-row 2xl:gap-x-4 items-start pt-8">
          {/* Left: Measurement Fields */}
          <div className="w-full 2xl:w-auto space-y-6 p-4 rounded-lg">
            <div className="space-y-3">
              {/* Collar */}
              <GroupedMeasurementFields
                form={form}
                title="Collar"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "collar.width", label: "Length" },
                  { name: "collar.height", label: "Height" },
                ]}
                forceColumn={true}
              />

              {/* Lengths */}
              <GroupedMeasurementFields
                form={form}
                title="Lengths"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "length.front", label: "Front" },
                  { name: "length.back", label: "Back" },
                ]}
                forceColumn={true}
              />

              {/* Arm */}
              <GroupedMeasurementFields
                form={form}
                title="Arm"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "shoulder", label: "Shoulder" },
                  { name: "sleeve", label: "Sleeve" },
                  { name: "elbow", label: "Elbow" },
                  { name: "armhole", label: "Armhole" },
                ]}
                forceColumn={true}
              />

              {/* Body */}
              <GroupedMeasurementFields
                form={form}
                title="Body"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "chest.upper", label: "Upper Chest" },
                  { name: "chest.full", label: "Full Chest" },
                  { name: "waist.front", label: "Full Waist" },
                  { name: "bottom", label: "Bottom" },
                ]}
                forceColumn={true}
              />

              {/* Top Pocket */}
              <GroupedMeasurementFields
                form={form}
                title="Top Pocket"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "topPocket.distance", label: "Distance" },
                  { name: "topPocket.length", label: "Length" },
                  { name: "topPocket.width", label: "Width" },
                ]}
                forceColumn={true}
              />

              {/* Jabzoor */}
              <GroupedMeasurementFields
                form={form}
                title="Jabzoor"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "jabzoor.length", label: "Length" },
                  { name: "jabzoor.width", label: "Width" },
                ]}
                forceColumn={true}
              />

              {/* Side Pocket */}
              <GroupedMeasurementFields
                form={form}
                title="Side Pocket"
                unit={unit}
                isDisabled={!isEditing}
                fields={[
                  { name: "sidePocket.length", label: "Length" },
                  { name: "sidePocket.width", label: "Width" },
                  { name: "sidePocket.distance", label: "Distance" },
                  { name: "sidePocket.opening", label: "Opening" },
                ]}
                forceColumn={true}
              />
            </div>
            <div className="space-y-6 pt-6">
              <FabricReferenceInput
                form={form}
                name="fabricReferenceNo"
                label="Fabric Reference No."
                isDisabled={!isEditing}
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
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* ---- Buttons ---- */}
        <div className="flex justify-center gap-6">
          {(isCreatingNew || isEditing) && (
            <Button
              type="button"
              variant="destructive"
              onClick={isCreatingNew ? handleCancelNew : handleCancelEdit}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" variant="outline" disabled={!isEditing}>
            Save Current Measurement
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleEdit}
            disabled={!selectedMeasurementId || isEditing}
          >
            Edit Existing
          </Button>
          {!isEditing && (
            <Button
              type="button"
              onClick={handleNewMeasurement}
              disabled={!customerId || isCreatingNew}
            >
              New Measurement
            </Button>
          )}
          <Button
            type="button"
            onClick={onProceed}
            disabled={
              measurements == null || Object.keys(measurements).length == 0
            }
          >
            Proceed
          </Button>
        </div>
      </form>
    </Form>
  );
}
