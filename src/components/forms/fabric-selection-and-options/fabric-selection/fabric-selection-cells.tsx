"use client";

import * as React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { getFabrics } from "@/api/fabrics";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import type { CellContext } from "@tanstack/react-table";
import type { FabricSelectionSchema } from "./fabric-selection-schema";

export const GarmentIdCell = ({
  row,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  return (
    <div className="min-w-[100px]">
      <Controller
        name={`fabricSelections.${row.index}.garmentId`}
        control={control}
        defaultValue={row.original.garmentId}
        render={({ field }) => <span>{field.value}</span>}
      />
    </div>
  );
};

export const MeasurementIdCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    measurementOptions?: { id: string; MeasurementID: string }[];
    isFormDisabled?: boolean;
  };
  const measurementOptions: { id: string; MeasurementID: string }[] =
    meta?.measurementOptions || [];
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="min-w-[150px]">
      <Controller
        name={`fabricSelections.${row.index}.measurementId`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isFormDisabled}
          >
            <SelectTrigger className="w-[150px] min-w-[150px]">
              <SelectValue placeholder="Select ID" />
            </SelectTrigger>
            <SelectContent>
              {measurementOptions.map(
                (m: { id: string; MeasurementID: string }) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.MeasurementID}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export const BrovaCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="w-full flex justify-center items-center min-w-[80px]">
      <Controller
        name={`fabricSelections.${row.index}.brova`}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const FabricSourceCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  const fabricSource = useWatch({
    name: `fabricSelections.${row.index}.fabricSource`,
  });

  React.useEffect(() => {
    if (fabricSource === "Out") {
      setValue(`fabricSelections.${row.index}.color`, "");
      setValue(`fabricSelections.${row.index}.fabricId`, "");
    }
  }, [fabricSource, row.index, setValue]);

  return (
    <div className="flex flex-col space-y-1 w-[200px] min-w-[180px]">
      <Controller
        name={`fabricSelections.${row.index}.fabricSource`}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={isFormDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In">In</SelectItem>
              <SelectItem value="Out">Out</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export const IfInsideCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  const [fabricSource, fabricId] = useWatch({
    name: [
      `fabricSelections.${row.index}.fabricSource`,
      `fabricSelections.${row.index}.fabricId`,
    ],
  });

  const isDisabled = fabricSource === "Out" || !fabricSource;
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });

  const fabrics = fabricsResponse?.data || [];

  React.useEffect(() => {
    if (fabricSource === "In" && fabricId) {
      const selectedFabric = fabrics.find((f) => f.id === fabricId);
      if (selectedFabric) {
        setValue(
          `fabricSelections.${row.index}.color`,
          selectedFabric.fields.Color
        );
      }
    }
  }, [fabricId, fabricSource, fabrics, row.index, setValue]);

  const fuse = React.useMemo(
    () =>
      new Fuse(fabrics, {
        keys: [
          "fields.Name",
          "fields.Code",
          "fields.Color",
          "fields.PricePerMeter",
          "fields.RealStock",
        ],
        includeScore: true,
      }),
    [fabrics]
  );
  const fabricOptions = React.useMemo(() => {
    const results = searchQuery
      ? fuse.search(searchQuery).map((r) => r.item)
      : fabrics;

    return results.map((fabric) => ({
      value: fabric.id,
      label: `${fabric.fields.Name} - ${fabric.fields.Code} - ${fabric.fields.Color} - ${fabric.fields.PricePerMeter} - ${fabric.fields.RealStock}`,
      node: (
        <div className="flex justify-between w-full">
          <span>{`${fabric.fields.Name} - ${fabric.fields.Code} - ${fabric.fields.Color}`}</span>
          <div className="flex gap-1">
            <span className="text-gray-500">{`Price: ${fabric.fields.PricePerMeter}`}</span>
            <span className="text-gray-500">{`Stock: ${fabric.fields.RealStock}`}</span>
          </div>
        </div>
      ),
    }));
  }, [fabrics, fuse, searchQuery]);

  return (
    <div className="flex flex-col space-y-1 w-[200px] min-w-[200px]">
      {isDisabled || isFormDisabled ? (
        <Input
          placeholder="Search fabric..."
          disabled
          className="cursor-not-allowed text-red-500"
        />
      ) : (
        <Controller
          name={`fabricSelections.${row.index}.fabricId`}
          control={control}
          render={({ field }) => (
            <Combobox
              options={fabricOptions}
              {...field}
              onChange={(value) => {
                field.onChange(value);
                setSearchQuery("");
              }}
              onSearch={setSearchQuery}
              placeholder="Search fabric..."
              disabled={isFormDisabled}
            />
          )}
        />
      )}
    </div>
  );
};

export const ColorCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  const fabricSource = useWatch({
    name: `fabricSelections.${row.index}.fabricSource`,
  });

  const isReadOnly = fabricSource === "In";

  return (
    <div className="min-w-[120px]">
      <Controller
        name={`fabricSelections.${row.index}.color`}
        control={control}
        render={({ field }) => (
          <Input
            className="min-w-[120px]"
            {...field}
            readOnly={isReadOnly || isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const FabricLengthCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control, setError, clearErrors } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });
  const fabrics = fabricsResponse?.data || [];

  const [fabricSource, fabricId, fabricLength] = useWatch({
    name: [
      `fabricSelections.${row.index}.fabricSource`,
      `fabricSelections.${row.index}.fabricId`,
      `fabricSelections.${row.index}.fabricLength`,
    ],
  });

  React.useEffect(() => {
    if (fabricSource === "In" && fabricId && fabricLength) {
      const selectedFabric = fabrics.find((f) => f.id === fabricId);
      if (selectedFabric) {
        const stock = selectedFabric.fields.RealStock || 0;
        if (parseFloat(fabricLength as string) > stock) {
          toast.error(`Stock unavailable. Available stock: ${stock}`);
          setError(`fabricSelections.${row.index}.fabricLength`, {
            type: "manual",
            message: "Stock unavailable",
          });
        } else {
          clearErrors(`fabricSelections.${row.index}.fabricLength`);
        }
      }
    }
  }, [
    fabricId,
    fabricLength,
    fabricSource,
    fabrics,
    setError,
    clearErrors,
    row.index,
  ]);

  return (
    <div className="min-w-[120px]">
      <Controller
        name={`fabricSelections.${row.index}.fabricLength`}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            className={cn("min-w-[120px]", error ? "border-red-500" : "")}
            readOnly={isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const ExpressCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="w-full flex justify-center items-center min-w-[80px]">
      <Controller
        name={`fabricSelections.${row.index}.express`}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value as boolean}
            onCheckedChange={field.onChange}
            disabled={isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const DeliveryDateCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="w-50 min-w-[150px]">
      <Controller
        name={`fabricSelections.${row.index}.deliveryDate`}
        control={control}
        render={({ field }) => (
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            disabled={isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const FabricAmountCell = ({
  row,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control, setValue } = useFormContext();
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });
  const fabrics = fabricsResponse?.data || [];

  const [fabricSource, fabricId, fabricLength] = useWatch({
    name: [
      `fabricSelections.${row.index}.fabricSource`,
      `fabricSelections.${row.index}.fabricId`,
      `fabricSelections.${row.index}.fabricLength`,
    ],
  });

  React.useEffect(() => {
    if (fabricSource === "Out") {
      setValue(`fabricSelections.${row.index}.fabricAmount`, 0);
      return;
    }

    if (fabricSource === "In" && fabricId && fabricLength) {
      const selectedFabric = fabrics.find((f) => f.id === fabricId);
      if (selectedFabric) {
        const pricePerMeter = selectedFabric.fields.PricePerMeter || 0;
        const amount = parseFloat(fabricLength as string) * pricePerMeter;
        setValue(`fabricSelections.${row.index}.fabricAmount`, amount);
      }
    } else {
      setValue(`fabricSelections.${row.index}.fabricAmount`, 0);
    }
  }, [fabricId, fabricLength, fabricSource, fabrics, row.index, setValue]);

  return (
    <div className="min-w-[160px]">
      <Controller
        name={`fabricSelections.${row.index}.fabricAmount`}
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            {...field}
            readOnly
            className="w-40 min-w-[160px]"
          />
        )}
      />
    </div>
  );
};

export const NoteCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;
  return (
    <div className="min-w-[150px]">
      <Controller
        name={`fabricSelections.${row.index}.note`}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            className="min-w-[190px] min-h-[40px] max-h-[190px]"
            readOnly={isFormDisabled}
          />
        )}
      />
    </div>
  );
};
