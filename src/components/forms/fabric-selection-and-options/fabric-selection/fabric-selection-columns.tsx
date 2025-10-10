"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type FabricSelectionSchema } from "./fabric-selection-schema";
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
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<FabricSelectionSchema>[] = [
  {
    accessorKey: "garmentId",
    header: "Garment ID",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.garmentId`}
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      );
    },
  },
  {
    accessorKey: "measurementId",
    header: "Measurement ID",
    cell: ({ row, table }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.measurementId`}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                {table.options.meta?.measurementIDs?.map((id: string) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      );
    },
  },
  {
    accessorKey: "brova",
    header: "Brova",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-full flex justify-center items-center">
          <Controller
            name={`fabricSelections.${row.index}.brova`}
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
    },
  },
  {
    accessorKey: "fabricSource",
    header: "Source",
    cell: ({ row }) => {
      const { control } = useFormContext();

      return (
        <div className="flex flex-col space-y-1 w-[200px]">
          <Controller
            name={`fabricSelections.${row.index}.fabricSource`}
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
    },
  },
  {
    accessorKey: "ifInside",
    header: "If inside",
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const fabricSource = watch(`fabricSelections.${row.index}.fabricSource`);
      const isDisabled = fabricSource === "Out";

      const { data: fabricsResponse } = useQuery({
        queryKey: ["fabrics"],
        queryFn: getFabrics,
      });

      const fabrics = fabricsResponse;

      const fabricOptions = fabrics?.data
        ? fabrics.data?.map((fabric) => ({
            value: fabric.id,
            label: fabric.fields.Name,
          }))
        : [];

      return (
        <div className="flex flex-col space-y-1 w-[200px]">
          {isDisabled ? (
            <Input
              placeholder="Search fabric..."
              disabled={true}
              className="cursor-not-allowed text-red-500"
            />
          ) : (
            <Controller
              name={`fabricSelections.${row.index}.fabricCode`}
              control={control}
              render={({ field }) => (
                <Combobox
                  options={fabricOptions}
                  {...field}
                  placeholder="Search fabric..."
                />
              )}
            />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color/ اللون",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.color`}
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      );
    },
  },
  {
    accessorKey: "fabricLength",
    header: "Fabric Length",
    cell: ({ row }) => {
      const { control, getValues } = useFormContext();
      const { data: fabricsResponse } = useQuery({
        queryKey: ["fabrics"],
        queryFn: getFabrics,
      });
      const fabrics = fabricsResponse;

      const checkStock = (lengthStr: string, code: string, source: string) => {
        if (source !== "In" || !lengthStr || !code) return;
        const length = parseFloat(lengthStr);
        const fabric = fabrics?.data?.find((f) => f.id === code);
        if (fabric && length > fabric.fields["REAL STOCK"]) {
          toast.error(
            `Not Enough Stock! Real Stock: ${fabric.fields["REAL STOCK"]}.`
          );
        }
      };

      const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const length = e.target.value;
        const code = getValues(`fabricSelections.${row.index}.fabricCode`);
        const source = getValues(`fabricSelections.${row.index}.fabricSource`);
        checkStock(length, code, source);
      };

      return (
        <Controller
          name={`fabricSelections.${row.index}.fabricLength`}
          control={control}
          render={({ field }) => <Input {...field} onBlur={handleBlur} />}
        />
      );
    },
  },
  {
    accessorKey: "express",
    header: "Express/مستعجل",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-full flex justify-center items-center">
          <Controller
            name={`fabricSelections.${row.index}.express`}
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
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date/موعد التسليم",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.deliveryDate`}
          control={control}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
      );
    },
  },
  {
    accessorKey: "fabricAmount",
    header: "Fabric Amount/سعر القماش",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.fabricAmount`}
          control={control}
          render={({ field }) => <Input type="number" {...field} readOnly />}
        />
      );
    },
  },
  {
    id: "delete",
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className={"w-10 h-10"} />
        </Button>
      );
    },
  },
];
