"use client";

import { getMeasurementsByCustomerId } from "@/api/measurements";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  FormProvider,
  type UseFormReturn,
  useFieldArray,
} from "react-hook-form";
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

interface FabricSelectionFormProps {
  customerId: string | null;
  orderId: string | null;
  form: UseFormReturn<{
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }>;
  onSubmit: (values: {
    fabricSelections: FabricSelectionSchema[];
    styleOptions: StyleOptionsSchema[];
  }) => void;
  onProceed: () => void;
  isProceedDisabled?: boolean;
  onCampaignsChange: (campaigns: string[]) => void;
}

export function FabricSelectionForm({
  customerId,
  orderId,
  form,
  onSubmit,
  onProceed,
  isProceedDisabled = false,
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<string[]>(
    []
  );

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

  const measurementIDs =
    measurementQuery?.data && measurementQuery.data.length > 0
      ? measurementQuery.data.map((m) => m.fields.MeasurementID)
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
            disabled={isSyncDisabled}
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
          measurementIDs={measurementIDs}
          updateData={(rowIndex, columnId, value) =>
            form.setValue(
              `fabricSelections.${rowIndex}.${columnId}` as any,
              value
            )
          }
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
          measurementIDs={measurementIDs}
          columns={styleOptionsColumns}
          data={styleOptionFields}
          removeRow={removeStyleRow}
          updateData={(rowIndex, columnId, value) =>
            form.setValue(`styleOptions.${rowIndex}.${columnId}` as any, value)
          }
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
        <Button
          className="m-4"
          variant={"outline"}
          onClick={() => {
            const errors = form.formState.errors;
            if (Object.keys(errors).length > 0) {
              console.error("Fabric selection form errors:", errors);
              // @ts-ignore
              const errorMessages = Object.values(errors.fabricSelections || {}).flatMap(fieldErrors => Object.values(fieldErrors || {}).map(error => error.message)).join("\n");
            }
            form.handleSubmit(onSubmit)();
          }}
        >
          Save Selections
        </Button>
        <Button
          className="m-4"
          onClick={onProceed}
          disabled={isProceedDisabled}
        >
          Proceed
        </Button>
      </div>
    </FormProvider>
  );
}
