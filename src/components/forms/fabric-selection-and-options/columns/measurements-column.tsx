import { type ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type FabricSelectionSchema } from "../schema";
import { useFormContext, Controller } from "react-hook-form";

export const measurementsColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Measurements",
    id: "measurements",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
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
                    {table.options.meta?.measurementIDs.map((id) => (
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
        accessorKey: "customize",
        header: "Customize",
        cell: ({ row }) => {
          const { control } = useFormContext();
          return (
            <div className="w-full flex justify-center items-center">
              <Controller
                name={`fabricSelections.${row.index}.customize`}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          );
        },
      },
    ],
  },
];
