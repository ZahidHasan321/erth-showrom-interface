"use client";

import { columns as fabricSelectionColumns } from "./fabric-selection/fabric-selection-columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { createWorkOrderStore } from "@/store/current-work-order";
import { useQuery } from "@tanstack/react-query";
import { getMeasurementsByCustomerId } from "@/api/measurements";
import * as React from "react";
import { FormProvider, useFieldArray } from "react-hook-form";
import {
  type FabricSelectionSchema,
  fabricSelectionDefaults,
} from "./fabric-selection/fabric-selection-schema";
import { columns as styleOptionsColumns } from "./style-options/style-options-columns";
import {
  type StyleOptionsSchema,
  styleOptionsDefaults,
} from "./style-options/style-options-schema";
import { type UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getCampaigns } from "@/api/campaigns";

interface FabricSelectionFormProps {
  useCurrentWorkOrderStore: ReturnType<typeof createWorkOrderStore>;
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
}

export function FabricSelectionForm({
  useCurrentWorkOrderStore,
  customerId,
  orderId,
  form,
  onSubmit,
  onProceed,
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const [selectedCampaign, setSelectedCampaign] = React.useState<string | null>(
    null
  );
  const {
    fabricSelections,
    setFabricSelections,
    styleOptions,
    setStyleOptions,
  } = useCurrentWorkOrderStore();

  const { data: campaignsResponse } = useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  const activeCampaigns =
    campaignsResponse?.data?.filter((c) => c.fields.Active) || [];

  const handleCampaignChange = (campaignId: string) => {
    setSelectedCampaign((prev) => (prev === campaignId ? null : campaignId));
  };

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

  console.log(fabricSelectionFields);

  React.useEffect(() => {
    // reset the form if the store's fabricSelections change from an external source.
    if (
      fabricSelections &&
      JSON.stringify(form.getValues("fabricSelections")) !==
        JSON.stringify(fabricSelections)
    ) {
      form.reset({ fabricSelections });
    }

    // Subscribe to form changes and update the store.
    const subscription = form.watch((value) => {
      const currentFabricSelections = value.fabricSelections || [];
      const currentStyleOptions = value.styleOptions || [];

      const filteredFabricSelections = currentFabricSelections.filter(
        Boolean
      ) as FabricSelectionSchema[];
      const filteredStyleOptions = currentStyleOptions.filter(
        Boolean
      ) as StyleOptionsSchema[];

      if (
        JSON.stringify(fabricSelections) !==
        JSON.stringify(filteredFabricSelections)
      ) {
        setFabricSelections(filteredFabricSelections);
      }
      if (
        JSON.stringify(styleOptions) !== JSON.stringify(filteredStyleOptions)
      ) {
        setStyleOptions(filteredStyleOptions);
      }
    });

    return () => subscription.unsubscribe();
  }, [
    fabricSelections,
    form,
    setFabricSelections,
    styleOptions,
    setStyleOptions,
  ]);

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

  const measurementIDs = React.useMemo(() => {
    if (measurementQuery?.data && measurementQuery.data.length > 0) {
      return measurementQuery.data.map((m) => m.fields.MeasurementID);
    }
    return [];
  }, [measurementQuery]);

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
    appendStyleOption({
      ...styleOptionsDefaults,
      styleOptionId: `S-${index + 1}`,
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
  const isSyncDisabled =
    !numRowsToAdd ||
    numRowsToAdd <= 0 ||
    (fabricSelectionFields.length === numRowsToAdd &&
      styleOptionFields.length === numRowsToAdd);

  return (
    <FormProvider {...form}>
      <div className="p-4 max-w-7xl w-full overflow-x-auto">
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
        <div className="flex items-center space-x-2 mb-6">
          <Label>Campaign Offers:</Label>
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center space-x-2">
              <Checkbox
                id={campaign.id}
                checked={selectedCampaign === campaign.id}
                onCheckedChange={() => handleCampaignChange(campaign.id)}
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
      </div>
      <div>
        <Button
          className="m-4"
          variant={"outline"}
          onClick={form.handleSubmit(onSubmit)}
        >
          Save Selections
        </Button>
        <Button className="m-4" onClick={onProceed}>
          Proceed
        </Button>
      </div>
    </FormProvider>
  );
}
