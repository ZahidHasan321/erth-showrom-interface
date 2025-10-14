"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { getFabrics } from "@/api/fabrics";
import { Combobox } from "@/components/ui/combobox";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

export function GarmentIdCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.garmentId`}
        control={control}
        render={({ field }) => <span>{field.value}</span>}
      />
    </div>
  );
}

export function MeasurementIdCell({
  rowIndex,
  measurementIDs,
}: {
  rowIndex: number;
  measurementIDs: string[];
}) {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.measurementId`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID" />
            </SelectTrigger>
            <SelectContent>
              {measurementIDs?.map((id: string) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

export function BrovaCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div className="w-full flex justify-center items-center">
      <Controller
        name={`fabricSelections.${rowIndex}.brova`}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

export function FabricSourceCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch, setValue } = useFormContext();
  const fabricSource = watch(`fabricSelections.${rowIndex}.fabricSource`);

  React.useEffect(() => {
    if (fabricSource === "Out") {
      setValue(`fabricSelections.${rowIndex}.color`, "");
      setValue(`fabricSelections.${rowIndex}.fabricId`, "");
    }
  }, [fabricSource, rowIndex, setValue]);

  return (
    <div className="flex flex-col space-y-1">
      <Controller
        name={`fabricSelections.${rowIndex}.fabricSource`}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
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
}

export function IfInsideCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch, setValue } = useFormContext();
  const fabricSource = watch(`fabricSelections.${rowIndex}.fabricSource`);
  const fabricId = watch(`fabricSelections.${rowIndex}.fabricId`);
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
          `fabricSelections.${rowIndex}.color`,
          selectedFabric.fields.Color
        );
      }
    }
  }, [fabricId, fabricSource, fabrics, rowIndex, setValue]);

  const fuse = new Fuse(fabrics, {
    keys: [
      "fields.Name",
      "fields.Code",
      "fields.Color",
      "fields.PricePerMeter",
      "fields.RealStock",
    ],
    includeScore: true,
  });

  const searchResults = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : fabrics;

  const fabricOptions = searchResults.map((fabric) => ({
    value: fabric.id,
    label: `${fabric.fields.Name} - ${fabric.fields.Code} - ${fabric.fields.Color} - ${fabric.fields.PricePerMeter} - ${fabric.fields.RealStock}`,
  }));

  return (
    <div className="flex flex-col space-y-1">
      {isDisabled ? (
        <Input
          placeholder="Search fabric..."
          disabled={true}
          className="cursor-not-allowed text-red-500"
        />
      ) : (
        <Controller
          name={`fabricSelections.${rowIndex}.fabricId`}
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
            />
          )}
        />
      )}
    </div>
  );
}

export function ColorCell({ rowIndex }: { rowIndex: number }) {
  const { control, watch } = useFormContext();
  const fabricSource = watch(`fabricSelections.${rowIndex}.fabricSource`);
  const isReadOnly = fabricSource === "In";

  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.color`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            readOnly={isReadOnly}
          />
        )}
      />
    </div>
  );
}

export function FabricLengthCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.fabricLength`}
        control={control}
        render={({ field }) => (
          <Input {...field} />
        )}
      />
    </div>
  );
}

export function ExpressCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div className="w-full flex justify-center items-center">
      <Controller
        name={`fabricSelections.${rowIndex}.express`}
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

export function DeliveryDateCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.deliveryDate`}
        control={control}
        render={({ field }) => (
          <DatePicker value={field.value} onChange={field.onChange} />
        )}
      />
    </div>
  );
}

export function FabricAmountCell({ rowIndex }: { rowIndex: number }) {
  const { control } = useFormContext();
  return (
    <div>
      <Controller
        name={`fabricSelections.${rowIndex}.fabricAmount`}
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            {...field}
            readOnly
          />
        )}
      />
    </div>
  );
}