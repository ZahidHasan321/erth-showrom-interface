"use client";

import { getFabrics } from "@/api/fabrics";
import { createGarment, updateGarment } from "@/api/garments";
import { getMeasurementsByCustomerId } from "@/api/measurements";
import { getStyles } from "@/api/styles";
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
import { getFabricValue } from "@/lib/utils/fabric-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, XCircle, Sparkles, Plus, X, Save, Pencil, ArrowRight } from "lucide-react";
import { SignaturePad } from "../signature-pad";
import { cn } from "@/lib/utils";

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
  onProceed: () => void;
  isProceedDisabled?: boolean;
  onCampaignsChange: (campaigns: string[]) => void;
  isOrderClosed: boolean;
  orderStatus?: "Pending" | "Completed" | "Cancelled";
  fatoura?: number;
  orderDate?: Date | string | null;
  initialCampaigns?: string[];
}

export function FabricSelectionForm({
  customerId,
  orderId,
  orderRecordId,
  form,
  onSubmit,
  onProceed,
  onCampaignsChange,
  isProceedDisabled = false,
  isOrderClosed,
  orderStatus,
  fatoura,
  orderDate,
  initialCampaigns = [],
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<string[]>(
    []
  );
  const [isEditing, setIsEditing] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [selectedMeasurementId, setSelectedMeasurementId] = React.useState<string | null>(null);
  const [fabricMeter, setFabricMeter] = React.useState<number | null>(null);
  const [qallabi, setQallabi] = React.useState<number | null>(null);
  const [cuffs, setCuffs] = React.useState<number | null>(null);

  // Set initial campaigns when prop changes (e.g., when loading an order)
  React.useEffect(() => {
    // Update selected campaigns whenever initialCampaigns prop changes
    // This handles both loading campaigns and clearing them
    setSelectedCampaigns(initialCampaigns || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCampaigns?.join(',')]);

  // Fetch fabrics for validation
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const fabrics = fabricsResponse?.data || [];

  // Fetch styles for pricing
  const { data: stylesResponse } = useQuery({
    queryKey: ["styles"],
    queryFn: getStyles,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const styles = stylesResponse?.data || [];


  // Validate fabric selections before saving
  const validateFabricSelections = React.useCallback(() => {
    const errors: string[] = [];
    const fabricSelections = form.getValues("fabricSelections");

    // Count valid (non-empty) fabric selections
    const validSelections = fabricSelections.filter((selection) => {
      return selection.fabricSource === "In" || selection.fabricSource === "Out";
    });

    // REQUIRE at least one fabric selection
    if (validSelections.length === 0) {
      errors.push("At least one fabric must be selected to save");
      return errors;
    }

    fabricSelections.forEach((selection, index) => {
      // Skip validation for completely empty rows (not started)
      const isRowEmpty = !selection.fabricSource &&
                         !selection.measurementId &&
                         !selection.fabricLength &&
                         !selection.fabricId &&
                         !selection.shopName &&
                         !selection.color;

      if (isRowEmpty) {
        return; // Skip this row
      }

      // If row has been started (has any field filled), validate all required fields
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

      // Validate delivery date when home delivery is selected
      if (selection.homeDelivery && !selection.deliveryDate) {
        errors.push(`Row ${index + 1}: Delivery date is required when home delivery is selected`);
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
        throw new Error("Please create an order first before saving fabric selections");
      }

      // Filter out empty rows before saving
      const validFabricSelections = data.fabricSelections.filter((selection) => {
        // A row is valid if it has at least a fabric source
        return selection.fabricSource === "In" || selection.fabricSource === "Out";
      });

      const promises = validFabricSelections.map(
        async (fabricSelection) => {
          // Get the original index to match with styleOptions
          const originalIndex = data.fabricSelections.indexOf(fabricSelection);
          const styleOption = data.styleOptions[originalIndex];

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
      console.log("API Response on Save:", responses);

      // Check for any errors in the responses
      const errorResponses = responses.filter(r => r.status === "error");

      if (errorResponses.length > 0) {
        // If any responses failed, show error
        const errorMessages = errorResponses.map(r => r.message || "Unknown error").join(", ");
        toast.error(`Failed to save ${errorResponses.length} garment(s): ${errorMessages}`);
        return;
      }

      // All responses successful
      toast.success(`${responses.length} garment(s) saved successfully!`);

      // Update form with response IDs only for valid selections
      const updatedFabricSelections = form
        .getValues("fabricSelections")
        .map((fabric) => {
          // Find matching response based on fabricSource being filled
          const responseIndex = responses.findIndex((_, i) => {
            const validSelections = form.getValues("fabricSelections").filter(s => s.fabricSource === "In" || s.fabricSource === "Out");
            return validSelections.indexOf(fabric) === i;
          });

          return {
            ...fabric,
            id: responses[responseIndex]?.data?.id || fabric.id,
            orderId: (fabric.fabricSource === "In" || fabric.fabricSource === "Out") ? [orderRecordId!] : fabric.orderId || [],
          };
        });

      // IMPORTANT: Update the form state with the new IDs
      // This ensures that subsequent edits will update the existing records
      form.setValue("fabricSelections", updatedFabricSelections);

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
      const errorMessage = error instanceof Error ? error.message : "Failed to save garments. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSaveSelections = () => {
    // Validate first
    const errors = validateFabricSelections();

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
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const measurements = measurementQuery?.data || [];

  React.useEffect(() => {
    if (selectedMeasurementId) {
      const selectedMeasurement = measurements.find(m => m.id === selectedMeasurementId);
      if (selectedMeasurement) {
        const length = selectedMeasurement.fields.LengthFront;
        const bottom = selectedMeasurement.fields.Bottom;

        if (length && bottom) {
          const meter = getFabricValue(length, bottom);
          if (meter) {
            setFabricMeter(meter);
            setQallabi(meter + 0.25);
            setCuffs(meter + 0.5);
          } else {
            setFabricMeter(null);
            setQallabi(null);
            setCuffs(null);
          }
        }
      }
    }
  }, [selectedMeasurementId, measurements, getFabricValue]);

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
    const latestMeasurement =
      measurements.length > 0 ? measurements[measurements.length - 1] : null;
    appendFabricSelection({
      ...fabricSelectionDefaults,
      garmentId: orderId + "-" + (index + 1),
      measurementId: latestMeasurement?.id ?? "",
    });
  };

  const removeFabricRow = (rowIndex: number) => {
    removeFabricSelection(rowIndex);
    // Also remove the corresponding style option row
    removeStyleOption(rowIndex);
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

  // Check if there are any form errors AND the form has been submitted
  const hasFormErrors = Object.keys(form.formState.errors).length > 0 && form.formState.isSubmitted;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSaveSelections, (errors) => console.log('validation errors: ', errors))}
        className="w-full space-y-6">

        {/* Title Section */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">
              Fabric Selection & Style Options
            </h1>
            <p className="text-sm text-muted-foreground">Choose fabrics and customize style options for garments</p>
          </div>
        </div>

        {/* Order Required Warning */}
        {!orderRecordId && !isOrderClosed && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Order Required</AlertTitle>
            <AlertDescription>
              Please complete the Demographics step and create an order before saving fabric selections.
            </AlertDescription>
          </Alert>
        )}

        <div className="p-6 border border-border rounded-xl bg-card w-full overflow-hidden shadow-sm space-y-6">
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
                  type="button"
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

          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {/* How many pieces? */}
              <div className="flex flex-col gap-4 items-center border border-border w-fit p-5 rounded-xl bg-accent/5 shadow-sm">
                <Label htmlFor="num-fabrics" className="text-base font-semibold">How many pieces?</Label>
                <Input
                  id="num-fabrics"
                  type="number"
                  placeholder="e.g., 2"
                  onChange={(e) => setNumRowsToAdd(parseInt(e.target.value, 10))}
                  className="w-24 bg-background border-border/60"
                  disabled={isFormDisabled}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (numRowsToAdd > 0) {
                      syncRows(numRowsToAdd, fabricSelectionFields, {
                        addRow: addFabricRow,
                        removeRow: removeFabricRow,
                      });
                      syncRows(numRowsToAdd, styleOptionFields, {
                        addRow: addStyleRow,
                        removeRow: removeStyleOption,
                      });
                    }
                  }}
                  disabled={isFormDisabled}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add / Sync
                </Button>
              </div>

              {/* Campaign Offers */}
              <div className="flex flex-col gap-3 border-2 border-primary/30 w-fit p-5 rounded-xl bg-linear-to-br from-primary/5 to-secondary/5 shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <Label className="text-lg font-bold text-primary">Campaign Offers</Label>
                </div>
                {activeCampaigns.length > 0 ? (
                  <div className="space-y-2">
                    {activeCampaigns.map((campaign) => (
                      <label
                        key={campaign.id}
                        htmlFor={campaign.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                          selectedCampaigns.includes(campaign.id)
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/50 bg-background hover:border-primary/50 hover:bg-accent/20"
                        )}
                      >
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
                        <span className={cn(
                          "font-medium text-sm",
                          selectedCampaigns.includes(campaign.id) ? "text-primary" : "text-foreground"
                        )}>
                          {campaign.fields.Name}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No active campaigns</p>
                )}
              </div>
            </div>

            {/* Measurement Helper */}
            <div className="flex flex-col gap-3 border border-border w-fit p-5 rounded-xl bg-accent/5 shadow-sm">
              <Label className="text-base font-semibold">Measurement Helper:</Label>
              <Select onValueChange={setSelectedMeasurementId} value={selectedMeasurementId || ""}>
                <SelectTrigger className="w-[180px] bg-background border-border/60">
                  <SelectValue placeholder="Select Measurement ID" />
                </SelectTrigger>
                <SelectContent>
                  {measurements.map((m) => (
                    <SelectItem key={m.id} value={m.id ?? ""}>
                      {m.fields.MeasurementID}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fabricMeter !== null && (
                <div className="mt-4">
                  <p><strong>Fabric Meter:</strong> {fabricMeter}</p>
                  <p><strong>Qallabi:</strong> {qallabi}</p>
                  <p><strong>Cuffs:</strong> {cuffs}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Fabric Selections</h2>
            <p className="text-sm text-muted-foreground">Select fabric source, type, and measurements for each garment</p>
          </div>
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
            orderStatus={orderStatus}
            fatoura={fatoura}
            orderDate={orderDate}
            orderID={orderId || undefined}
          />

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Signature</h3>
            <SignaturePad
              onSave={(signature) => {
                console.log("Fabric Signature:", signature);
              }}
            />
          </div>

          <div className="space-y-1 pt-4">
            <h2 className="text-2xl font-bold text-foreground">Style Options</h2>
            <p className="text-sm text-muted-foreground">Customize collar, pockets, buttons, and other style details</p>
          </div>
          <DataTable
            columns={styleOptionsColumns}
            measurementOptions={measurementOptions}
            data={styleOptionFields}
            removeRow={removeStyleRow}
            updateData={(rowIndex, columnId, value) =>
              form.setValue(`styleOptions.${rowIndex}.${columnId}` as any, value)
            }
            isFormDisabled={isFormDisabled}
            styles={styles}
          />

          <div className="space-y-2 pt-4">
            <h3 className="text-lg font-semibold text-foreground">Customer Signature</h3>
            <SignaturePad
              onSave={(signature) => {
                console.log("Style Signature:", signature);
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          {isOrderClosed ? null : !isSaved || isEditing ? (
            <>
              {isEditing && isSaved && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setValidationErrors([]);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSaving || !orderRecordId}
                title={!orderRecordId ? "Please create an order first (Demographics step)" : ""}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : !orderRecordId ? "Order Required" : "Save Selections"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Delay the state change slightly to avoid instant re-render focus-submit
                  setTimeout(() => setIsEditing(true), 0);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Selections
              </Button>
              <Button
                type="button"
                onClick={onProceed}
                disabled={isProceedDisabled}
              >
                Continue to Payment & Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}