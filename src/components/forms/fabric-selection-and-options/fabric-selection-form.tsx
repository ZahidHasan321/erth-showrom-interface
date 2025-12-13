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
  useFieldArray,
  Controller
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
import { assignMatchingStyleIds } from "@/lib/utils/style-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, XCircle, Sparkles, Plus, X, Save, Pencil, ArrowRight, Copy, Printer } from "lucide-react";
import { SignaturePad } from "../signature-pad";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";
import { FabricLabel } from "./fabric-selection/fabric-print-component";

interface FabricSelectionFormProps {
  customerId: string | null;
  customerName?: string;
  customerMobile?: string;
  orderId: string | null;
  orderRecordId: string | null;
  form: UseFormReturn<{
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
    signature: string;
  }>;
  onSubmit?: (data: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
    signature: string;
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
  customerName,
  customerMobile,
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

  // Temporary stock tracking: Map of fabricId -> total length used
  const [tempStockUsage, setTempStockUsage] = React.useState<Map<string, number>>(new Map());

  // Print All Labels ref
  const printAllRef = React.useRef<HTMLDivElement>(null);

  // Print All Labels handler
  const handlePrintAll = useReactToPrint({
    contentRef: printAllRef,
    documentTitle: `Fabric-Labels-${orderId || 'all'}`,
    pageStyle: `
      @page {
        size: 5in 4in;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      }
    `,
  });

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

  // Calculate temporary stock usage based on current form values
  const calculateTempStockUsage = React.useCallback(() => {
    const fabricSelections = form.getValues("fabricSelections");
    const usage = new Map<string, number>();

    fabricSelections.forEach((selection) => {
      if (selection.fabricSource === "IN" && selection.fabricId) {
        const length = parseFloat(selection.fabricLength) || 0;
        if (length > 0) {
          const currentUsage = usage.get(selection.fabricId) || 0;
          usage.set(selection.fabricId, currentUsage + length);
        }
      }
    });

    return usage;
  }, [form]);

  // Initialize temporary stock usage on mount or when fabric selections are loaded
  React.useEffect(() => {
    const initialUsage = calculateTempStockUsage();
    setTempStockUsage(initialUsage);
  }, [calculateTempStockUsage]);

  // Update temporary stock usage whenever fabric selections change
  React.useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      // Only recalculate if fabric-related fields change
      if (name?.startsWith("fabricSelections")) {
        const newUsage = calculateTempStockUsage();
        setTempStockUsage(newUsage);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, calculateTempStockUsage]);

  // Update style option IDs when style options change to match identical styles
  React.useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      // Only recalculate if style-related fields change (but NOT styleOptionId itself)
      if (name?.startsWith("styleOptions") && !name?.includes("styleOptionId")) {
        const currentStyleOptions = form.getValues("styleOptions");

        // Safety check
        if (!currentStyleOptions || currentStyleOptions.length === 0) {
          return;
        }

        const updatedStyleOptions = assignMatchingStyleIds(currentStyleOptions);

        // Only update if IDs actually changed to avoid infinite loops
        const needsUpdate = updatedStyleOptions.some((updated, index) => {
          const current = currentStyleOptions[index];
          return current && updated && updated.styleOptionId !== current.styleOptionId;
        });

        if (needsUpdate) {
          updatedStyleOptions.forEach((updated, index) => {
            if (updated?.styleOptionId) {
              form.setValue(`styleOptions.${index}.styleOptionId`, updated.styleOptionId, {
                shouldValidate: false,
                shouldDirty: false,
                shouldTouch: false
              });
            }
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Validate fabric selections before saving
  const validateFabricSelections = React.useCallback(() => {
    const errors: string[] = [];
    const fabricSelections = form.getValues("fabricSelections");

    // Count valid (non-empty) fabric selections
    const validSelections = fabricSelections.filter((selection) => {
      return selection.fabricSource === "IN" || selection.fabricSource === "OUT";
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

      // Validate stock for "IN" source
      if (selection.fabricSource === "IN") {
        if (!selection.fabricId) {
          errors.push(`Row ${index + 1}: Fabric selection is required for "IN" source`);
        } else {
          const selectedFabric = fabrics.find((f) => f.id === selection.fabricId);
          if (selectedFabric) {
            const realStock = selectedFabric.fields.RealStock || 0;
            const requestedLength = parseFloat(selection.fabricLength);

            // Calculate total usage of this fabric across all rows
            const totalUsage = tempStockUsage.get(selection.fabricId) || 0;

            if (!isNaN(requestedLength) && totalUsage > realStock) {
              errors.push(
                `Row ${index + 1}: Insufficient stock. Total requested for this fabric: ${totalUsage.toFixed(2)}m, Available: ${realStock}m`
              );
            }
          }
        }

        if (!selection.color) {
          errors.push(`Row ${index + 1}: Color is required`);
        }
      }

      // Validate "OUT" source
      if (selection.fabricSource === "OUT" && !selection.color) {
        errors.push(`Row ${index + 1}: Color is required for "OUT" source`);
      }

      // Validate delivery date is always required
      if (!selection.deliveryDate) {
        errors.push(`Row ${index + 1}: Delivery date is required`);
      }
    });

    return errors;
  }, [form, fabrics, tempStockUsage]);

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
        return selection.fabricSource === "IN" || selection.fabricSource === "OUT";
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
            const validSelections = form.getValues("fabricSelections").filter(s => s.fabricSource === "IN" || s.fabricSource === "OUT");
            return validSelections.indexOf(fabric) === i;
          });

          return {
            ...fabric,
            id: responses[responseIndex]?.data?.id || fabric.id,
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
        signature: form.getValues("signature"),
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

  const addFabricRow = (index: number, orderIdParam?: string) => {
    const latestMeasurement =
      measurements.length > 0 ? measurements[measurements.length - 1] : null;
    const currentOrderId = orderIdParam || orderId || "";
    appendFabricSelection({
      ...fabricSelectionDefaults,
      garmentId: currentOrderId + "-" + (index + 1),
      measurementId: latestMeasurement?.id ?? "",
    });
  };

  const removeFabricRow = (rowIndex: number) => {
    removeFabricSelection(rowIndex);
    // Also remove the corresponding style option row
    removeStyleOption(rowIndex);

    // Re-index garmentIds for remaining rows after the removed row
    const currentOrderId = orderId || "";
    const fabricSelections = form.getValues("fabricSelections");

    // Update garmentIds for all rows after the removed index
    fabricSelections.forEach((_, index) => {
      if (index >= rowIndex) {
        const newGarmentId = currentOrderId + "-" + (index + 1);
        form.setValue(`fabricSelections.${index}.garmentId`, newGarmentId);
        form.setValue(`styleOptions.${index}.garmentId`, newGarmentId);
      }
    });

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

  // Copy first row fabric selections to all other rows
  const copyFabricSelectionsToAll = () => {
    const fabricSelections = form.getValues("fabricSelections");
    if (fabricSelections.length < 2) {
      toast.info("Need at least 2 rows to copy");
      return;
    }

    const firstRow = fabricSelections[0];
    const updatedSelections = fabricSelections.map((selection, index) => {
      if (index === 0) return selection; // Keep first row as is

      // Copy all fabric selection fields except id, garmentId, orderId, and measurementId
      return {
        ...selection,
        brova: firstRow.brova,
        fabricSource: firstRow.fabricSource,
        fabricId: firstRow.fabricId,
        shopName: firstRow.shopName,
        color: firstRow.color,
        fabricLength: firstRow.fabricLength,
        ifInside: firstRow.ifInside,
        express: firstRow.express,
        homeDelivery: firstRow.homeDelivery,
        deliveryDate: firstRow.deliveryDate,
        note: firstRow.note,
        fabricAmount: firstRow.fabricAmount,
      };
    });

    form.setValue("fabricSelections", updatedSelections);
    toast.success("Copied first row's fabric selections to all rows");
  };

  // Copy first row style options to all other rows
  const copyStyleOptionsToAll = () => {
    const styleOptions = form.getValues("styleOptions");
    if (styleOptions.length < 2) {
      toast.info("Need at least 2 rows to copy");
      return;
    }

    const firstRow = styleOptions[0];

    // Copy to each subsequent row
    for (let i = 1; i < styleOptions.length; i++) {
      // Copy top-level fields
      form.setValue(`styleOptions.${i}.style`, firstRow.style);
      form.setValue(`styleOptions.${i}.extraAmount`, firstRow.extraAmount);

      // Copy nested lines object
      if (firstRow.lines) {
        form.setValue(`styleOptions.${i}.lines.line1`, firstRow.lines.line1);
        form.setValue(`styleOptions.${i}.lines.line2`, firstRow.lines.line2);
      }

      // Copy nested collar object
      if (firstRow.collar) {
        form.setValue(`styleOptions.${i}.collar.collarType`, firstRow.collar.collarType);
        form.setValue(`styleOptions.${i}.collar.collarButton`, firstRow.collar.collarButton);
        form.setValue(`styleOptions.${i}.collar.smallTabaggi`, firstRow.collar.smallTabaggi);
      }

      // Copy nested jabzoor object
      if (firstRow.jabzoor) {
        form.setValue(`styleOptions.${i}.jabzoor.jabzour1`, firstRow.jabzoor.jabzour1);
        form.setValue(`styleOptions.${i}.jabzoor.jabzour2`, firstRow.jabzoor.jabzour2);
        form.setValue(`styleOptions.${i}.jabzoor.jabzour_thickness`, firstRow.jabzoor.jabzour_thickness);
      }

      // Copy nested frontPocket object
      if (firstRow.frontPocket) {
        form.setValue(`styleOptions.${i}.frontPocket.front_pocket_type`, firstRow.frontPocket.front_pocket_type);
        form.setValue(`styleOptions.${i}.frontPocket.front_pocket_thickness`, firstRow.frontPocket.front_pocket_thickness);
      }

      // Copy nested accessories object
      if (firstRow.accessories) {
        form.setValue(`styleOptions.${i}.accessories.phone`, firstRow.accessories.phone);
        form.setValue(`styleOptions.${i}.accessories.wallet`, firstRow.accessories.wallet);
        form.setValue(`styleOptions.${i}.accessories.pen_holder`, firstRow.accessories.pen_holder);
      }

      // Copy nested cuffs object
      if (firstRow.cuffs) {
        form.setValue(`styleOptions.${i}.cuffs.hasCuffs`, firstRow.cuffs.hasCuffs);
        form.setValue(`styleOptions.${i}.cuffs.cuffs_type`, firstRow.cuffs.cuffs_type);
        form.setValue(`styleOptions.${i}.cuffs.cuffs_thickness`, firstRow.cuffs.cuffs_thickness);
      }
    }

    toast.success("Copied first row's style options to all rows");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSaveSelections, (errors) => console.log('validation errors: ', errors, form.getValues()))}
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

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Fabric Selections</h2>
              <p className="text-sm text-muted-foreground">Select fabric source, type, and measurements for each garment</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyFabricSelectionsToAll}
              disabled={isFormDisabled || fabricSelectionFields.length < 2}
              title="Copy first row's fabric selections to all other rows"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy First Row
            </Button>
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
            customerId={customerId || undefined}
            customerName={customerName || undefined}
            customerMobile={customerMobile || undefined}
            tempStockUsage={tempStockUsage}
          />

          {/* Print All Labels Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrintAll}
              disabled={fabricSelectionFields.length === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print All Labels
            </Button>
          </div>

          {/* Hidden component for printing all labels */}
          <div style={{ display: "none" }}>
            <div ref={printAllRef}>
              {fabricSelectionFields.map((_, index) => {
                const currentRowData = form.getValues(`fabricSelections.${index}`) as FabricSelectionSchema;
                const measurementDisplay = measurementOptions.find(
                  m => m.id === currentRowData.measurementId
                )?.MeasurementID || currentRowData.measurementId;

                const fabricData = {
                  orderId: orderId || "N/A",
                  customerId: customerId || "N/A",
                  customerName: customerName || "N/A",
                  customerMobile: customerMobile || "N/A",
                  garmentId: currentRowData.garmentId || "",
                  fabricSource: currentRowData.fabricSource || "",
                  fabricId: currentRowData.fabricId || "",
                  fabricLength: currentRowData.fabricLength || "",
                  measurementId: measurementDisplay,
                  brova: currentRowData.brova || false,
                  express: currentRowData.express || false,
                  deliveryDate: currentRowData.deliveryDate || null,
                };

                return (
                  <div key={index} className={index < fabricSelectionFields.length - 1 ? "page-break" : ""}>
                    <FabricLabel fabricData={fabricData} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-end pt-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">Style Options</h2>
              <p className="text-sm text-muted-foreground">Customize collar, pockets, buttons, and other style details</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyStyleOptionsToAll}
              disabled={isFormDisabled || styleOptionFields.length < 2}
              title="Copy first row's style options to all other rows"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy First Row
            </Button>
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
            <h3 className="text-lg font-semibold text-foreground">
              Customer Signature
              <span className="text-destructive"> *</span>
            </h3>
            <Controller
              name="signature"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <div className="w-fit">
                    {field.value ? (
                      <div className="space-y-2">
                        <div className="border rounded-lg bg-white/70">
                          <img src={field.value} alt="Customer signature" style={{ width: '500px', height: '200px', display: 'block' }} />
                        </div>
                        {!isFormDisabled && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange("")}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear Signature
                          </Button>
                        )}
                      </div>
                    ) : !isFormDisabled ? (
                      <SignaturePad
                        onSave={(signature) => {
                          field.onChange(signature);
                          toast.success("Signature saved");
                        }}
                      />
                    ) : (
                      <div className="border rounded-lg bg-muted text-center text-muted-foreground" style={{ width: '500px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No signature provided
                      </div>
                    )}
                  </div>
                  {fieldState.error && (
                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
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