"use client";

import { getMeasurementsByCustomerId } from "@/api/measurements";
import { createGarment, updateGarment } from "@/api/garments";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as React from "react";
import {
  FormProvider,
  type UseFormReturn,
  useFieldArray,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "../signature-pad";
import { mapFormGarmentToApiGarment } from "@/lib/garment-mapper";

interface FabricSelectionFormProps {
  customerId: string | null;
  orderId: string | null;
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
}

export function FabricSelectionForm({
  customerId,
  orderId,
  onEdit,
  form,
  onSubmit,
  onProceed,
  isProceedDisabled = false,
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<string[]>(
    []
  );
  const [isEditing, setIsEditing] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);

  // Mutation to save garments
  const { mutate: saveGarmentsMutation, isPending: isSaving } = useMutation({
    mutationFn: async (data: {
      fabricSelections: FabricSelectionSchema[];
      styleOptions: StyleOptionsSchema[];
    }) => {
      if (!orderId) {
        throw new Error("No order ID available");
      }

      const promises = data.fabricSelections.map(
        async (fabricSelection, index) => {
          const styleOption = data.styleOptions[index];

          const fabricWithOrderId = {
            ...fabricSelection,
            orderId: [orderId],
          };

          const garmentData = mapFormGarmentToApiGarment(
            fabricWithOrderId,
            styleOption
          );

          // Update if ID exists, otherwise create
          if (fabricSelection.id && fabricSelection.id !== "") {
            console.log("update: ", garmentData.fields);
            return updateGarment(fabricSelection.id, garmentData.fields);
          } else {
            console.log("create: ", garmentData.fields);
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

      form.setValue("fabricSelections", updatedFabricSelections);

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
  const isSyncDisabled = numRowsToAdd <= 0;
  const isFormDisabled = isSaved && !isEditing;

  return (
    <FormProvider {...form}>
      <div className="p-4 border rounded-lg bg-muted max-w-full w-full overflow-hidden">
        <div className="flex items-center space-x-2 mb-4">
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
            disabled={isSyncDisabled || isFormDisabled}
          >
            Add / Sync
          </Button>
        </div>
        <div className="flex flex-col gap-2 mb-6 border shadow-lg w-fit p-4 rounded-lg bg-card">
          <Label className="text-md text-bold">Campaign Offers:</Label>
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center space-x-2">
              <Checkbox
                id={campaign.id}
                checked={selectedCampaigns.includes(campaign.id)}
                onCheckedChange={(checked) => {
                  setSelectedCampaigns((prev) =>
                    checked
                      ? Array.from(new Set([...prev, campaign.id]))
                      : prev.filter((id) => id !== campaign.id)
                  );
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
        {/* <Button
          onClick={addFabricRow}
          className="mt-4"
          disabled={!(measurementIDs.length === 0)}
        >
          Add Fabric Line
        </Button> */}

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
        {/* <Button onClick={addStyleRow} className="mt-4">
          Add Style Line
        </Button> */}

        <h2 className="font-bold mb-2 mt-8">Signature</h2>
        <SignaturePad
          onSave={(signature) => {
            console.log("Style Signature:", signature);
          }}
        />
      </div>
      <div>
        {!isSaved || isEditing ? (
          <>
            <Button
              className="m-4"
              variant={"outline"}
              onClick={() => {
                const errors = form.formState.errors;
                if (Object.keys(errors).length > 0) {
                  console.error("Fabric selection form errors:", errors);
                }
                handleSaveSelections();
              }}
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
    </FormProvider>
  );
}
