"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import Fuse from "fuse.js";
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
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<FabricSelectionSchema>[] = [
  {
    accessorKey: "garmentId",
    header: "Garment ID",
    minSize: 100,
    cell: ({ row }) => {
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
    },
  },
  {
    accessorKey: "measurementId",
    header: "Measurement ID",
    minSize: 150,
    cell: ({ row, table }) => {
      const { control } = useFormContext();
      return (
        <div className="min-w-[150px]">
          <Controller
            name={`fabricSelections.${row.index}.measurementId`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[150px] min-w-[150px]">
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
        </div>
      );
    },
  },
  {
    accessorKey: "brova",
    header: "Brova",
    minSize: 80,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-full flex justify-center items-center min-w-[80px]">
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
    minSize: 180,
    cell: ({ row }) => {
      const { control, watch, setValue } = useFormContext();
      const fabricSource = watch(`fabricSelections.${row.index}.fabricSource`);

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
    minSize: 200,
    cell: ({ row }) => {
      const { control, watch, setValue } = useFormContext();
      const fabricSource = watch(`fabricSelections.${row.index}.fabricSource`);
      const fabricId = watch(`fabricSelections.${row.index}.fabricId`);
      const isDisabled = fabricSource === "Out" || !fabricSource;
      const [searchQuery, setSearchQuery] = React.useState("");

      const { data: fabricsResponse } = useQuery({
        queryKey: ["fabrics"],
        queryFn: getFabrics,
      });

      const fabrics = fabricsResponse?.data || [];

      // When fabricSource or fabricId changes, update the color field if source is "In"
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
        <div className="flex flex-col space-y-1 w-[200px] min-w-[200px]">
          {isDisabled ? (
            <Input
              placeholder="Search fabric..."
              disabled={true}
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
    minSize: 120,
    cell: ({ row }) => {
      const { control, watch } = useFormContext();
      const fabricSource = watch(`fabricSelections.${row.index}.fabricSource`);
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
                readOnly={isReadOnly}
              />
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "fabricLength",
    header: "Fabric Length",
    minSize: 120,
    cell: ({ row }) => {
      const { control } = useFormContext();

      return (
        <div className="min-w-[120px]">
          <Controller
            name={`fabricSelections.${row.index}.fabricLength`}
            control={control}
            render={({ field }) => (
              <Input {...field} className="min-w-[120px]" />
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "express",
    header: "Express/مستعجل",
    minSize: 80,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-full flex justify-center items-center min-w-[80px]">
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
    minSize: 150,
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <div className="w-50 min-w-[150px]">
          <Controller
            name={`fabricSelections.${row.index}.deliveryDate`}
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "fabricAmount",
    header: "Fabric Amount/سعر القماش",
    minSize: 160,
    cell: ({ row }) => {
      const { control } = useFormContext();
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
    },
  },
  {
    id: "delete",
    minSize: 80,
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 color="red" />
        </Button>
      );
    },
  },
];
