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
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isFormDisabled}
            >
              <SelectTrigger className={cn(
                "w-[150px] min-w-[150px] bg-background border-border/60",
                error && "border-destructive"
              )}>
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
            {error && (
              <span className="text-xs text-destructive">{error.message}</span>
            )}
          </div>
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
    <div className="w-full flex justify-center items-center min-w-20">
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

  const previousFabricSource = React.useRef(fabricSource);

  React.useEffect(() => {
    // Only clear color when actively changing from "In" to "Out", not on initial load
    if (fabricSource === "Out" && previousFabricSource.current === "In") {
      setValue(`fabricSelections.${row.index}.color`, "", { shouldValidate: true });
      setValue(`fabricSelections.${row.index}.fabricId`, "", { shouldValidate: true });
    }
    previousFabricSource.current = fabricSource;
  }, [fabricSource, row.index, setValue]);

  return (
    <div className="flex flex-col space-y-1 w-[200px] min-w-[180px]">
      <Controller
        name={`fabricSelections.${row.index}.fabricSource`}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isFormDisabled}
            >
              <SelectTrigger className={cn(
                "bg-background border-border/60",
                error && "border-destructive"
              )}>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In">In</SelectItem>
                <SelectItem value="Out">Out</SelectItem>
              </SelectContent>
            </Select>
            {error && (
              <span className="text-xs text-destructive">{error.message}</span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export const ShopNameCell = ({
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

  const isDisabled = fabricSource !== "Out";

  return (
    <div className="min-w-[150px]">
      <Controller
        name={`fabricSelections.${row.index}.shopName`}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <Input
              className={cn(
                "min-w-[150px] bg-background border-border/60",
                error && "border-destructive"
              )}
              placeholder="Enter shop name"
              {...field}
              disabled={isDisabled || isFormDisabled}
            />
            {error && (
              <span className="text-xs text-destructive">{error.message}</span>
            )}
          </div>
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
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const fabrics = fabricsResponse?.data || [];

  React.useEffect(() => {
    if (fabricSource === "In" && fabricId) {
      const selectedFabric = fabrics.find((f) => f.id === fabricId);
      if (selectedFabric) {
        setValue(
          `fabricSelections.${row.index}.color`,
          selectedFabric.fields.Color,
          { shouldValidate: true, shouldDirty: true }
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
            <span className="text-muted-foreground">{`Price: ${fabric.fields.PricePerMeter}`}</span>
            <span className="text-muted-foreground">{`Stock: ${fabric.fields.RealStock}`}</span>
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
          className="cursor-not-allowed text-destructive bg-muted border-border/60"
        />
      ) : (
        <Controller
          name={`fabricSelections.${row.index}.fabricId`}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col gap-1">
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
                className={cn(
                  "bg-background border-border/60",
                  error && "border-destructive"
                )}
              />
              {error && (
                <span className="text-xs text-destructive">{error.message}</span>
              )}
            </div>
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
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <Input
              className={cn(
                "min-w-[120px]",
                isReadOnly ? "bg-muted border-border/60" : "bg-background border-border/60",
                error && "border-destructive"
              )}
              {...field}
              readOnly={isReadOnly || isFormDisabled}
            />
            {error && (
              <span className="text-xs text-destructive">{error.message}</span>
            )}
          </div>
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
    staleTime: Infinity,
    gcTime: Infinity,
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
        const requestedLength = parseFloat(fabricLength as string);

        if (isNaN(requestedLength) || requestedLength <= 0) {
          setError(`fabricSelections.${row.index}.fabricLength`, {
            type: "manual",
            message: "Invalid length",
          });
        } else if (requestedLength > stock) {
          setError(`fabricSelections.${row.index}.fabricLength`, {
            type: "manual",
            message: `Insufficient stock (Available: ${stock})`,
          });
          toast.error(`Row ${row.index + 1}: Stock unavailable. Available: ${stock}`);
        } else {
          clearErrors(`fabricSelections.${row.index}.fabricLength`);
        }
      }
    } else if (fabricSource === "Out" && fabricLength) {
      const requestedLength = parseFloat(fabricLength as string);
      if (isNaN(requestedLength) || requestedLength <= 0) {
        setError(`fabricSelections.${row.index}.fabricLength`, {
          type: "manual",
          message: "Invalid length",
        });
      } else {
        clearErrors(`fabricSelections.${row.index}.fabricLength`);
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
          <div className="flex flex-col gap-1">
            <Input
              {...field}
              type="number"
              step="0.01"
              className={cn(
                "min-w-[120px] bg-background border-border/60",
                error && "border-destructive"
              )}
              readOnly={isFormDisabled}
            />
            {error && (
              <span className="text-xs text-destructive">{error.message}</span>
            )}
          </div>
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
    <div className="w-full flex flex-col justify-center items-center min-w-28">
      <Controller
        name={`fabricSelections.${row.index}.express`}
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1 items-center">
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={isFormDisabled}
            />
          </div>
        )}
      />
    </div>
  );
};

export const DeliveryDateCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control, setValue, getValues, setError, clearErrors } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  const [homeDelivery, deliveryDate] = useWatch({
    name: [
      `fabricSelections.${row.index}.homeDelivery`,
      `fabricSelections.${row.index}.deliveryDate`,
    ],
  });

  // Validate delivery date is required when home delivery is selected
  React.useEffect(() => {
    if (homeDelivery && !deliveryDate) {
      setError(`fabricSelections.${row.index}.deliveryDate`, {
        type: "manual",
        message: "Required for home delivery",
      });
    } else {
      clearErrors(`fabricSelections.${row.index}.deliveryDate`);
    }
  }, [homeDelivery, deliveryDate, row.index, setError, clearErrors]);

  const handleDateChange = (date: Date | null) => {
    // Update current row
    setValue(`fabricSelections.${row.index}.deliveryDate`, date);

    if (row.index === 0) {
      const fabricSelections = getValues("fabricSelections") || [];
      // Loop through all rows and update delivery date
      for (let index = 1; index < fabricSelections.length; index++) {
        setValue(`fabricSelections.${index}.deliveryDate`, date);
      }
    }
  };

  return (
    <div className="w-50 min-w-[150px]">
      <Controller
        name={`fabricSelections.${row.index}.deliveryDate`}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col gap-1">
            <DatePicker
              value={field.value}
              onChange={handleDateChange}
              disabled={isFormDisabled}
              className={cn(
                "bg-background border-border/60",
                error && "border-destructive"
              )}
            />
            {error && (
              <span className="text-xs text-destructive whitespace-nowrap">{error.message}</span>
            )}
          </div>
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
    staleTime: Infinity
    
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
        setValue(`fabricSelections.${row.index}.fabricAmount`, parseFloat(amount.toFixed(2)));
      }
    } else {
      setValue(`fabricSelections.${row.index}.fabricAmount`, 0);
    }
  }, [fabricId, fabricLength, fabricSource, fabrics, row.index, setValue]);

  return (
    <div className="min-w-40">
      <Controller
        name={`fabricSelections.${row.index}.fabricAmount`}
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            {...field}
            value={typeof field.value === 'number' ? field.value.toFixed(2) : '0.00'}
            readOnly
            className="w-40 min-w-40 bg-muted border-border/60"
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
            className="min-w-[190px] min-h-10 max-h-[190px] bg-background border-border/60"
            readOnly={isFormDisabled}
          />
        )}
      />
    </div>
  );
};

export const HomeDeliveryCell = ({
  row,
  table,
}: CellContext<FabricSelectionSchema, unknown>) => {
  const { control } = useFormContext();
  const meta = table.options.meta as {
    isFormDisabled?: boolean;
  };
  const isFormDisabled = meta?.isFormDisabled || false;

  return (
    <div className="w-full flex justify-center items-center min-w-20">
      <Controller
        name={`fabricSelections.${row.index}.homeDelivery`}
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