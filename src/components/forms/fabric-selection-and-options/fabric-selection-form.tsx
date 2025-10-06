"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { createWorkOrderStore } from "@/store/current-work-order";
import { useQuery } from "@tanstack/react-query";
import { getMeasurementsByCustomerId } from "@/api/measurements";
import * as React from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  fabricSelectionSchema,
  type FabricSelectionSchema,
  fabricSelectionDefaults,
} from "./schema";
import z from "zod";

interface FabricSelectionFormProps {
  useCurrentWorkOrderStore: ReturnType<typeof createWorkOrderStore>;
  customerId: string | null;
}

export function FabricSelectionForm({
  useCurrentWorkOrderStore,
  customerId,
}: FabricSelectionFormProps) {
  const { fabricSelections, setFabricSelections } = useCurrentWorkOrderStore();

  const methods = useForm<{
    fabricSelections: FabricSelectionSchema[];
  }>({
    resolver: zodResolver(
      z.object({ fabricSelections: z.array(fabricSelectionSchema) })
    ),
    defaultValues: {
      fabricSelections: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fabricSelections",
  });

  React.useEffect(() => {
    // reset the form if the store's fabricSelections change from an external source.
    if (
      fabricSelections &&
      JSON.stringify(methods.getValues("fabricSelections")) !==
        JSON.stringify(fabricSelections)
    ) {
      methods.reset({ fabricSelections });
    }

    // Subscribe to form changes and update the store.
    const subscription = methods.watch((value) => {
      const currentSelections = value.fabricSelections || [];
      // Filter out any undefined/null values that might appear during form state changes.
      const filteredSelections = currentSelections.filter(
        Boolean
      ) as FabricSelectionSchema[];

      if (
        JSON.stringify(fabricSelections) !== JSON.stringify(filteredSelections)
      ) {
        setFabricSelections(filteredSelections);
      }
    });

    return () => subscription.unsubscribe();
  }, [fabricSelections, methods, setFabricSelections]);

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

  const addRow = () => {
    append(fabricSelectionDefaults);
  };

  const removeRow = (rowIndex: number) => {
    remove(rowIndex);
  };

  return (
    <FormProvider {...methods}>
      <div className="p-4 max-w-6xl overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">
          Fabric Selection and Options
        </h2>
        <DataTable
          columns={columns}
          data={fields}
          removeRow={removeRow}
          measurementIDs={measurementIDs}
        />
        <Button
          onClick={addRow}
          className="mt-4"
          disabled={measurementIDs.length === 0}
        >
          Add Lines
        </Button>
      </div>
    </FormProvider>
  );
}
