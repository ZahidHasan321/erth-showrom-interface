"use client";

import { getFabrics } from "@/api/fabrics";
import { createGarment, updateGarment } from "@/api/garments";
import { getMeasurementsByCustomerId } from "@/api/measurements";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  FormProvider,
  type UseFormReturn,
  useFieldArray
} from "react-hook-form";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { columns as fabricSelectionColumns } from "./fabric-selection/fabric-selection-columns";
import {
  type FabricSelectionSchema,
  fabricSelectionDefaults,
} from "./fabric-selection/fabric-selection-schema";
import { columns as styleOptionsColumns } from "./style-options/style-options-columns";
import {
  type StyleOptionsSchema,
  styleOptionsDefaults,
} from "./style-options/style-options-schema";

import { getCampaigns } from "@/api/campaigns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mapFormGarmentToApiGarment } from "@/lib/garment-mapper";
import { AlertCircle, XCircle } from "lucide-react";
import { SignaturePad } from "../signature-pad";

interface FabricSelectionFormProps {
  customerId: string | null;
  orderId: string | null;
  orderRecordId: string | null;
  form: UseFormReturn<{
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }>;
  onSubmit?: (data: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }) => void;
  onEdit?: () => void;
  onProceed: () => void;
  isProceedDisabled?: boolean;
  onCampaignsChange: (campaigns: string[]) => void;
  isOrderClosed: boolean;
}

export function FabricSelectionForm({
  customerId,
  orderId,
  orderRecordId,
  onEdit,
  form,
  onSubmit,
  onProceed,
  onCampaignsChange,
  isProceedDisabled = false,
  isOrderClosed,
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<string[]>(
    []
  );
  const [isEditing, setIsEditing] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);

  // Fetch fabrics for validation
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });

  const fabrics = fabricsResponse?.data || [];

  // Validate stock before saving
  const validateStock = React.useCallback(() => {
    const errors: string[] = [];
    const fabricSelections = form.getValues("fabricSelections");

    fabricSelections.forEach((selection, index) => {
      // Check if required fields are filled
      if (!selection.fabricSource) {
        errors.push(`Row ${index + 1}: Fabric source is required`);
      }

      if (!selection.measurementId) {
        errors.push(`Row ${index + 1}: Measurement ID is required`);
      }

      if (!selection.fabricLength || parseFloat(selection.fabricLength) <= 0) {
        errors.push(`Row ${index + 1}: Valid fabric length is required`);
      }

      // Validate stock for "In" source
      if (selection.fabricSource === "In") {
        if (!selection.fabricId) {
          errors.push(`Row ${index + 1}: Fabric selection is required for "In" source`);
        } else {
          const selectedFabric = fabrics.find((f) => f.id === selection.fabricId);
          if (selectedFabric) {
            const stock = selectedFabric.fields.RealStock || 0;
            const requestedLength = parseFloat(selection.fabricLength);

            if (!isNaN(requestedLength) && requestedLength > stock) {
              errors.push(
                `Row ${index + 1}: Insufficient stock. Requested: ${requestedLength}, Available: ${stock}`
              );
            }
          }
        }

        if (!selection.color) {
          errors.push(`Row ${index + 1}: Color is required`);
        }
      }

      // Validate "Out" source
      if (selection.fabricSource === "Out" && !selection.color) {
        errors.push(`Row ${index + 1}: Color is required for "Out" source`);
      }
    });

    return errors;
  }, [form, fabrics]);

  // Mutation to save garments
  const { mutate: saveGarmentsMutation, isPending: isSaving } = useMutation({
    mutationFn: async (data: {
      fabricSelections: FabricSelectionSchema[];
      styleOptions: StyleOptionsSchema[];
    }) => {
      if (!orderRecordId) {
        throw new Error("No order ID available");
      }

      const promises = data.fabricSelections.map(
        async (fabricSelection, index) => {
          const styleOption = data.styleOptions[index];

          const fabricWithOrderId = {
            ...fabricSelection,
            orderId: [orderRecordId],
          };

          const garmentData = mapFormGarmentToApiGarment(
            fabricWithOrderId,
            styleOption
          );


          // Update if ID exists, otherwise create
          if (fabricSelection.id && fabricSelection.id !== "") {
            return updateGarment(fabricSelection.id, garmentData.fields);
          } else {
            return createGarment(garmentData.fields);
          }
        }
      );

      return Promise.all(promises);
    },
    onSuccess: (responses) => {
      toast.success(`${responses.length} garment(s) saved successfully!`);

      // Update form with response IDs
      const updatedFabricSelections = form
        .getValues("fabricSelections")
        .map((fabric, index) => ({
          ...fabric,
          id: responses[index]?.data?.id || fabric.id,
          orderId: [orderId!],
        }));

      setValidationErrors([]);
      setIsSaved(true);
      setIsEditing(false);

      onSubmit?.({
        fabricSelections: updatedFabricSelections,
        styleOptions: form.getValues("styleOptions"),
      });
    },
    onError: (error) => {
      console.error("Failed to save garments:", error);
      toast.error("Failed to save garments. Please try again.");
    },
  });

  const handleSaveSelections = () => {
    // Validate first
    const errors = validateStock();

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error(`Cannot save: ${errors.length} validation error(s) found`);

      // Scroll to the validation alert
      setTimeout(() => {
        const alertElement = document.getElementById("validation-errors");
        if (alertElement) {
          alertElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return;
    }

    // Clear errors and proceed with save
    setValidationErrors([]);
    const data = form.getValues();
    saveGarmentsMutation(data);
  };

  const { data: campaignsResponse, isSuccess: campaignResSuccess } = useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const activeCampaigns =
    campaignResSuccess && campaignsResponse && campaignsResponse.data
      ? campaignsResponse.data
      : [];

  const {
    fields: fabricSelectionFields,
    append: appendFabricSelection,
    remove: removeFabricSelection,
  } = useFieldArray({
    control: form.control,
    name: "fabricSelections",
  });

  const {
    fields: styleOptionFields,
    append: appendStyleOption,
    remove: removeStyleOption,
  } = useFieldArray({
    control: form.control,
    name: "styleOptions",
  });

  const { data: measurementQuery } = useQuery({
    queryKey: ["measurements", customerId],
    queryFn: () => {
      if (!customerId) {
        return Promise.resolve(null);
      }
      return getMeasurementsByCustomerId(customerId);
    },
    enabled: !!customerId,
  });

  // Pass array of { id, MeasurementID } for dropdown
  const measurementOptions =
    measurementQuery?.data && measurementQuery.data.length > 0
      ? measurementQuery.data
        .filter((m) => !!m.id)
        .map((m) => ({
          id: m.id as string,
          MeasurementID: m.fields.MeasurementID,
        }))
      : [];

  const addFabricRow = (index: number, orderId?: string) => {
    appendFabricSelection({
      ...fabricSelectionDefaults,
      garmentId: orderId + "-" + (index + 1),
    });
  };

  const removeFabricRow = (rowIndex: number) => {
    removeFabricSelection(rowIndex);
    // Clear validation errors for this row
    setValidationErrors((prev) =>
      prev.filter((error) => !error.startsWith(`Row ${rowIndex + 1}:`))
    );
  };

  const addStyleRow = (index: number) => {
    const fabricGarmentId = form.getValues(
      `fabricSelections.${index}.garmentId`
    );
    appendStyleOption({
      ...styleOptionsDefaults,
      styleOptionId: `S-${index + 1}`,
      garmentId: fabricGarmentId,
    });
  };

  const removeStyleRow = (rowIndex: number) => {
    removeStyleOption(rowIndex);
  };

  function syncRows(
    desiredCount: number,
    fields: any[],
    handlers: {
      addRow: (index: number, orderId?: string) => void;
      removeRow: (rowIndex: number) => void;
    }
  ) {
    const currentCount = fields.length;

    if (currentCount < desiredCount) {
      for (let i = currentCount; i < desiredCount; i++) {
        handlers.addRow(i, orderId || undefined);
      }
    } else if (currentCount > desiredCount) {
      for (let i = currentCount - 1; i >= desiredCount; i--) {
        handlers.removeRow(i);
      }
    }
  }

  const isFormDisabled = isSaved && !isEditing;

  // Check if there are any form errors
  const hasFormErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSaveSelections)}
      className="w-full">
        <div className="p-4 border rounded-lg bg-muted w-full overflow-hidden">
          {/* Validation Errors Alert */}
          {validationErrors.length > 0 && (
            <Alert
              id="validation-errors"
              variant="destructive"
              className="mb-4 border-2 border-red-500"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-bold">
                Validation Errors ({validationErrors.length})
              </AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setValidationErrors([])}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Form Errors Alert */}
          {hasFormErrors && validationErrors.length === 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Form has errors</AlertTitle>
              <AlertDescription>
                Please check the fields marked in red and correct the errors
                before saving.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap items-center space-x-2 mb-4 gap-4">
            <Label htmlFor="num-fabrics">How many pieces? </Label>
            <Input
              id="num-fabrics"
              type="number"
              placeholder="e.g., 2"
              onChange={(e) => setNumRowsToAdd(parseInt(e.target.value, 10))}
              className="w-24"
              disabled={isFormDisabled}
            />

            <Button
              onClick={() => {
                if (numRowsToAdd > 0) {
                  syncRows(numRowsToAdd, fabricSelectionFields, {
                    addRow: addFabricRow,
                    removeRow: removeFabricRow,
                  });
                  syncRows(numRowsToAdd, styleOptionFields, {
                    addRow: addStyleRow,
                    removeRow: removeStyleRow,
                  });
                }
              }}
              disabled={isFormDisabled}
            >
              Add / Sync
            </Button>
          </div>
          <div className="flex flex-col gap-2 mb-6 border shadow-lg w-fit p-4 rounded-lg bg-card">
            <Label className="text-md text-bold">Campaign Offers:</Label>
            {activeCampaigns.length &&
              activeCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={campaign.id}
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={(checked) => {
                      const updatedCampaigns = checked
                        ? Array.from(new Set([...selectedCampaigns, campaign.id]))
                        : selectedCampaigns.filter((id) => id !== campaign.id);

                      setSelectedCampaigns(updatedCampaigns);
                      onCampaignsChange(updatedCampaigns);
                    }}
                    disabled={isFormDisabled}
                  />
                  <Label htmlFor={campaign.id}>{campaign.fields.Name}</Label>
                </div>
              ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Fabric Selections</h2>
          <DataTable
            columns={fabricSelectionColumns}
            data={fabricSelectionFields}
            removeRow={removeFabricRow}
            measurementOptions={measurementOptions}
            updateData={(rowIndex, columnId, value) =>
              form.setValue(
                `fabricSelections.${rowIndex}.${columnId}` as any,
                value
              )
            }
            isFormDisabled={isFormDisabled}
          />
          <h2 className="font-bold mb-2 mt-8">Signature</h2>
          <SignaturePad
            onSave={(signature) => {
              console.log("Fabric Signature:", signature);
            }}
          />

          <h2 className="text-2xl font-bold mb-4 mt-8">Style Options</h2>
          <DataTable
            columns={styleOptionsColumns}
            measurementOptions={measurementOptions}
            data={styleOptionFields}
            removeRow={removeStyleRow}
            updateData={(rowIndex, columnId, value) =>
              form.setValue(`styleOptions.${rowIndex}.${columnId}` as any, value)
            }
            isFormDisabled={isFormDisabled}
          />

          <h2 className="font-bold mb-2 mt-8">Signature</h2>
          <SignaturePad
            onSave={(signature) => {
              console.log("Style Signature:", signature);
            }}
          />
        </div>
        <div>
          {isOrderClosed ? null : !isSaved || isEditing ? (
            <>
              <Button
                className="m-4"
                variant={"outline"}
                // onClick={handleSaveSelections}
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Selections"}
              </Button>
              {isEditing && isSaved && (
                <Button
                  className="m-4"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setValidationErrors([]);
                  }}
                >
                  Cancel
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                className="m-4"
                variant={"outline"}
                onClick={() => {
                  setIsEditing(true);
                  onEdit?.();
                }}
              >
                Edit Selections
              </Button>
              <Button
                className="m-4"
                onClick={onProceed}
                disabled={isProceedDisabled}
              >
                Proceed
              </Button>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}