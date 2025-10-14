"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GroupedMeasurementFields } from "./GroupedMeasurementFields";

import {
  customerMeasurementsSchema,
  type CustomerMeasurementsSchema
} from "./schema";

import {
  getMeasurementsByCustomerId,
  upsertMeasurement
} from "@/api/measurements";
import {
  mapFormValuesToMeasurement,
  mapMeasurementToFormValues
} from "@/lib/measurement-mapper";
import { toast } from "sonner";

// ---------------------------------------
// Type definitions
// ---------------------------------------
interface CustomerMeasurementsFormProps {
  form: UseFormReturn<z.infer<typeof customerMeasurementsSchema>>;
  onSubmit: (values: z.infer<typeof customerMeasurementsSchema>) => void;
  customerId: string | null;
  onProceed?: () => void;
}


const unit = "cm";

// ---------------------------------------
// Custom hook for auto provision updates
// ---------------------------------------
function useAutoProvision(form: UseFormReturn<CustomerMeasurementsSchema>) {
  // Armhole Provision
  const [armholeValue, armholeFront, armholeProvision] = useWatch({
    control: form.control,
    name: ["arm.armhole.value", "arm.armhole.front", "arm.armhole.provision"],
  });

  React.useEffect(() => {
    if (armholeValue !== undefined && armholeFront !== undefined) {
      const newProvision = Math.max(0, armholeFront * 2 - armholeValue);
      if (armholeProvision !== newProvision) {
        form.setValue("arm.armhole.provision", newProvision);
      }
    }
  }, [armholeValue, armholeFront, armholeProvision]);

  // Full Chest Provision
  const [fullChestValue, fullChestFront, fullChestProvision] = useWatch({
    control: form.control,
    name: [
      "body.full_chest.value",
      "body.full_chest.front",
      "body.full_chest.provision",
    ],
  });

  React.useEffect(() => {
    if (fullChestValue !== undefined && fullChestFront !== undefined) {
      const newProvision = Math.max(0, fullChestFront * 2 - fullChestValue);
      if (fullChestProvision !== newProvision) {
        form.setValue("body.full_chest.provision", newProvision);
      }
    }
  }, [fullChestValue, fullChestFront, fullChestProvision]);

  // Full Waist Provision
  const [fullWaistValue, fullWaistFront, fullWaistBack, fullWaistProvision] =
    useWatch({
      control: form.control,
      name: [
        "body.full_waist.value",
        "body.full_waist.front",
        "body.full_waist.back",
        "body.full_waist.provision",
      ],
    });

  React.useEffect(() => {
    if (
      fullWaistValue !== undefined &&
      fullWaistFront !== undefined &&
      fullWaistBack !== undefined
    ) {
      const newProvision = Math.max(
        0,
        fullWaistFront + fullWaistBack - fullWaistValue,
      );
      if (fullWaistProvision !== newProvision) {
        form.setValue("body.full_waist.provision", newProvision);
      }
    }
  }, [fullWaistValue, fullWaistFront, fullWaistBack, fullWaistProvision]);
}


// ---------------------------------------
// Main Form Component
// ---------------------------------------
export function CustomerMeasurementsForm({
  form,
  onSubmit,
  customerId,
  onProceed,
}: CustomerMeasurementsFormProps) {

  const [selectedMeasurementId, setSelectedMeasurementId] = React.useState<string | null>(null)
  const [measurements, setMeasurements] = React.useState<Map<string, CustomerMeasurementsSchema>>(
    new Map()
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);
  const [previousMeasurementId, setPreviousMeasurementId] = React.useState<
    string | null
  >(null);
  const [confirmationDialog, setConfirmationDialog] = React.useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });

  useAutoProvision(form);

  // For adding a *new* measurement (must be complete)
  const addMeasurement = (id: string, data: CustomerMeasurementsSchema) => {
    setMeasurements(prev => {
      const updated = new Map(prev);
      updated.set(id, data);
      return updated;
    });
  };

  // For updating (partial allowed)
  // const updateMeasurement = (id: string, data: Partial<CustomerMeasurementsSchema>) => {
  //   setMeasurements(prev => ({
  //     ...prev,
  //     [id]: { ...prev.get(id), ...data },
  //   }));
  // };

  const removeMeasurement = (id: string) => {
    setMeasurements((prev): Map<string, CustomerMeasurementsSchema> => {
      if (!prev.has(id)) return prev;
      const updated = new Map<string, CustomerMeasurementsSchema>(prev);
      updated.delete(id);
      return updated;
    });
  };

  const { data: measurementQuery, isSuccess } = useQuery({
    queryKey: ["measurements", customerId],
    queryFn: () => {
      if (!customerId) {
        return Promise.resolve(null);
      }
      return getMeasurementsByCustomerId(customerId);
    },
    enabled: customerId ? true : false,
  });


  React.useEffect(() => {
    if (!customerId) {
      form.reset();
      setMeasurements(new Map());
      setSelectedMeasurementId(null);
      setIsEditing(false);
      setIsCreatingNew(false);
    }
  }, [customerId, form]);

  React.useEffect(() => {
    if (!customerId || !isSuccess) return;
    if (!measurementQuery?.data?.length) return;

    setMeasurements(() => {
      const newMap = new Map();
      measurementQuery?.data?.forEach((m) => {
        newMap.set(m.fields.MeasurementID, mapMeasurementToFormValues(m));
      });
      return newMap;
    });

    setSelectedMeasurementId(measurementQuery.data.at(0)?.fields.MeasurementID ?? null)

  }, [customerId, isSuccess, measurementQuery]);

  // Reset form when selected measurement changes
  React.useEffect(() => {
    if (selectedMeasurementId && measurements) {
      const selected = measurements.get(selectedMeasurementId);
      // Only reset if the form's current measurementID is different from the selected one
      if (selected) {
        form.reset(selected);
      } else {
        form.reset();
      }
    } else {
      form.reset();
    }
  }, [selectedMeasurementId, measurements, form]);

  // ---------------------------------------
  // Handlers
  // ---------------------------------------
  const handleFormSubmit = async (values: z.infer<typeof customerMeasurementsSchema>) => {
    if (!customerId) {
      toast.error("Customer ID is required.");
      return;
    }
    const record = mapFormValuesToMeasurement(values, Number(customerId));
    try {
      const response = await upsertMeasurement([record]);

      if (response.status === "success" && response.data && response.data.records.length > 0) {
        setIsEditing(false);
        setIsCreatingNew(false);
        toast.success("Measurement saved successfully!");
      } else {
        toast.error(response.message || "Failed to save measurement.");
      }
    } catch (e) {
      console.error("API Error:", e);
      toast.error("Error saving measurement.");
    }
    onSubmit(values);
  };

  const handleSave = async () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm Save",
      description: "Are you sure you want to save these measurements?",
      onConfirm: () => {
        form.handleSubmit(handleFormSubmit)();
        setConfirmationDialog((d) => ({ ...d, isOpen: false }));
      },
    });
  }

  const handleNewMeasurement = () => {
    setConfirmationDialog({
      isOpen: true,
      title: "Confirm New Measurement",
      description:
        "Are you sure you want to create a new measurement? Unsaved changes will be lost.",
      onConfirm: () => {
        setPreviousMeasurementId(selectedMeasurementId);
        setIsCreatingNew(true);
        setIsEditing(true);

        const existingIds = measurements ? Object.keys(measurements) : [];
        const nextNumber =
          existingIds
            .map((id) => parseInt(id.split("-")[1] || "0", 10))
            .reduce((a, b) => Math.max(a, b), 0) + 1;

        const newId = `${customerId}-${nextNumber}`;
        form.setValue("measurementID", newId);
        const baseMeasurement = form.getValues()

        addMeasurement(newId, baseMeasurement);
        setSelectedMeasurementId(newId);

        setConfirmationDialog((d) => ({ ...d, isOpen: false }));
      },
    });
  }

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreatingNew(false);
    if (isCreatingNew) {
      removeMeasurement(form.getValues("measurementID"));
      setSelectedMeasurementId(previousMeasurementId);
    } else if (selectedMeasurementId && measurements) {
      form.reset(measurements.get(selectedMeasurementId));
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-8 w-full"
      >
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() =>
            setConfirmationDialog((d) => ({ ...d, isOpen: false }))
          }
          onConfirm={confirmationDialog.onConfirm}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
        />

        <h1 className="text-2xl font-bold mb-4">Measurement</h1>

        {/* ---- Top Controls ---- */}
        <div className="flex flex-wrap w-fit justify-start gap-6 bg-muted p-4 rounded-lg">
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
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Body">Body</SelectItem>
                    <SelectItem value="Dishdasha">Dishdasha</SelectItem>
                  </SelectContent>
                </Select>
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
                    if (value) setSelectedMeasurementId(value);
                  }}
                  value={field.value}
                  disabled={!customerId || isCreatingNew}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white w-auto">
                      <SelectValue placeholder="Select ID" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(measurements.keys()).map((id) => (
                      <SelectItem key={id} value={id}>
                        {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measurementReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!isEditing}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white w-auto">
                      <SelectValue placeholder="Reference" />
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
              </FormItem>
            )}
          />
        </div>

        {/* ---- Measurement Groups ---- */}
        <div className="flex flex-col flex-wrap gap-4 items-start pt-8">
          <div className="flex flex-row gap-6 flex-wrap">
            <GroupedMeasurementFields
              form={form}
              title="Collar"
              unit={unit}
              isDisabled={!isEditing}
              fields={[
                { name: "collar.width", label: "Length" },
                { name: "collar.height", label: "Height" },
              ]}
            />
            <GroupedMeasurementFields
              form={form}
              title="Lengths"
              unit={unit}
              isDisabled={!isEditing}
              fields={[
                { name: "lengths.front", label: "Front" },
                { name: "lengths.back", label: "Back" },
              ]}
            />
          </div>

          <GroupedMeasurementFields
            form={form}
            title="Arm"
            unit={unit}
            isDisabled={!isEditing}
            fields={[
              { name: "arm.shoulder", label: "Shoulder" },
              { name: "arm.sleeve", label: "Sleeve" },
              { name: "arm.elbow", label: "Elbow" },
              [
                { name: "arm.armhole.value", label: "Armhole" },
                { name: "arm.armhole.front", label: "Front" },
                {
                  name: "arm.armhole.provision",
                  label: "Provision",
                  isDisabled: true,
                },
              ],
            ]}
          />

          <GroupedMeasurementFields
            form={form}
            title="Body"
            unit={unit}
            isDisabled={!isEditing}
            fields={[
              { name: "body.upper_chest", label: "Upper Chest" },
              [
                { name: "body.full_chest.value", label: "Full Chest" },
                { name: "body.full_chest.front", label: "Front" },
                {
                  name: "body.full_chest.provision",
                  label: "Provision",
                  isDisabled: true,
                },
              ],
              [
                { name: "body.full_waist.value", label: "Full Waist" },
                { name: "body.full_waist.front", label: "Front" },
                { name: "body.full_waist.back", label: "Back" },
                {
                  name: "body.full_waist.provision",
                  label: "Provision",
                  isDisabled: true,
                },
              ],
              { name: "body.bottom", label: "Bottom" },
            ]}
          />
        </div>

        <div className="flex flex-row gap-6 flex-wrap">
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
          />
          <GroupedMeasurementFields
            form={form}
            title="Jabzoor"
            unit={unit}
            isDisabled={!isEditing}
            fields={[
              { name: "jabzoor.length", label: "Length" },
              { name: "jabzoor.width", label: "Width" },
            ]}
          />
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
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Special requests or notes"
                  {...field}
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---- Buttons ---- */}
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={!selectedMeasurementId || isEditing}
          >
            Edit
          </Button>
          {(isEditing || isCreatingNew) && (
            <div className="flex gap-4">
              <Button type="button" variant="destructive" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={!isEditing}>
                Save
              </Button>
            </div>
          )}
          {!isEditing && (
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleNewMeasurement}
                disabled={!customerId || isCreatingNew}
              >
                New Measurement
              </Button>
              <Button
                type="button"
                onClick={onProceed}
                disabled={!measurements}
              >
                Proceed
              </Button>

            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

