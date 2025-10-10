import { getFabrics } from "@/api/fabrics";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { type FabricSelectionSchema } from "../schema";

const FabricSelector = ({ rowIndex }: { rowIndex: number }) => {
  const { control } = useFormContext();

  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });

  const fabrics = fabricsResponse;

  const fabricOptions = fabrics
    ? fabrics.map((fabric) => ({
        value: fabric.id,
        label: fabric.fields.Name,
      }))
    : [];

  return (
    <Controller
      name={`fabricSelections.${rowIndex}.fabricDetails.fabricCode`}
      control={control}
      render={({ field }) => (
        <Combobox
          options={fabricOptions}
          {...field}
          placeholder="Search fabric..."
        />
      )}
    />
  );
};

const FabricLengthInput = ({ rowIndex }: { rowIndex: number }) => {
  const { control, getValues } = useFormContext();
  const { data: fabricsResponse } = useQuery({
    queryKey: ["fabrics"],
    queryFn: getFabrics,
  });
  const fabrics = fabricsResponse;

  // const fabricSource = watch(
  //   `fabricSelections.${rowIndex}.fabricDetails.fabricSource`
  // );
  // const fabricCode = watch(
  //   `fabricSelections.${rowIndex}.fabricDetails.fabricCode`
  // );
  // const fabricLength = watch(
  //   `fabricSelections.${rowIndex}.fabricDetails.fabricLength`
  // );

  const checkStock = (lengthStr: string, code: string, source: string) => {
    if (source !== "In" || !lengthStr || !code) return;
    const length = parseFloat(lengthStr);
    const fabric = fabrics?.find((f) => f.id === code);
    if (fabric && length > fabric.fields["REAL STOCK"]) {
      toast.error(
        `Not Enough Stock! Real Stock: ${fabric.fields["REAL STOCK"]}.`
      );
    }
  };

  // React.useEffect(() => {
  //   checkStock(fabricLength, fabricCode, fabricSource);
  // }, [fabricSource, fabricCode, fabrics]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const length = e.target.value;
    const code = getValues(
      `fabricSelections.${rowIndex}.fabricDetails.fabricCode`
    );
    const source = getValues(
      `fabricSelections.${rowIndex}.fabricDetails.fabricSource`
    );
    checkStock(length, code, source);
  };

  return (
    <Controller
      name={`fabricSelections.${rowIndex}.fabricDetails.fabricLength`}
      control={control}
      render={({ field }) => <Input {...field} onBlur={handleBlur} />}
    />
  );
};

const FabricSourceCell = ({ rowIndex }: { rowIndex: number }) => {
  const { control, watch } = useFormContext();
  const fabricSource = watch(
    `fabricSelections.${rowIndex}.fabricDetails.fabricSource`
  );

  return (
    <div className="flex flex-col space-y-1 w-[200px]">
      <Controller
        name={`fabricSelections.${rowIndex}.fabricDetails.fabricSource`}
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
      {fabricSource === "In" && <FabricSelector rowIndex={rowIndex} />}
    </div>
  );
};

export const fabricDetailsColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Fabric Details",
    id: "fabric-details",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "fabricDetails.fabricSource",
        header: "Source",
        cell: ({ row }) => <FabricSourceCell rowIndex={row.index} />,
      },
      {
        accessorKey: "fabricDetails.fabricLength",
        header: "Fabric Length",
        cell: ({ row }) => {
          return <FabricLengthInput rowIndex={row.index} />;
        },
      },
    ],
  },
];
