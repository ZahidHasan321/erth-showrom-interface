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

interface FabricSelectionFormProps {
  useCurrentWorkOrderStore: ReturnType<typeof createWorkOrderStore>;
  customerId: string | null;
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
  form,
  onSubmit,
  onProceed,
}: FabricSelectionFormProps) {
  const [numRowsToAdd, setNumRowsToAdd] = React.useState(0);
  const {
    fabricSelections,
    setFabricSelections,
    styleOptions,
    setStyleOptions,
  } = useCurrentWorkOrderStore();

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

  const addFabricRow = () => {
    appendFabricSelection(fabricSelectionDefaults);
  };

  const removeFabricRow = (rowIndex: number) => {
    removeFabricSelection(rowIndex);
  };

  const addStyleRow = () => {
    appendStyleOption(styleOptionsDefaults);
  };

  const removeStyleRow = (rowIndex: number) => {
    removeStyleOption(rowIndex);
  };

  return (
    <FormProvider {...form}>
      <div className="p-4 max-w-7xl w-full overflow-x-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Label htmlFor="num-fabrics">Add Lines</Label>
          <Input
            id="num-fabrics"
            type="number"
            placeholder="e.g., 2"
            onChange={(e) => setNumRowsToAdd(parseInt(e.target.value, 10))}
            className="w-24"
          />
          <Button
            onClick={() => {
              if (numRowsToAdd && numRowsToAdd > 0) {
                for (let i = 0; i < numRowsToAdd; i++) {
                  appendFabricSelection(fabricSelectionDefaults);
                  appendStyleOption(styleOptionsDefaults);
                }
              }
            }}
            disabled={!numRowsToAdd || numRowsToAdd <= 0}
          >
            Add
          </Button>
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
        <Button
          onClick={addFabricRow}
          className="mt-4"
          disabled={!(measurementIDs.length === 0)}
        >
          Add Fabric Line
        </Button>

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
        <Button onClick={addStyleRow} className="mt-4">
          Add Style Line
        </Button>
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
