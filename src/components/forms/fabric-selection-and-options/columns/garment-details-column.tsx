import { type ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { type FabricSelectionSchema } from "../schema";
import { useFormContext, Controller } from "react-hook-form";

export const garmentDetailsColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Garment Details",
    id: "garment-details",
    meta: { className: "px-4" },
    columns: [
      {
        accessorKey: "garmentDetails.garmentId",
        header: "Garment ID",
        cell: ({ row }) => {
          const { control } = useFormContext();
          return (
            <Controller
              name={`fabricSelections.${row.index}.garmentDetails.garmentId`}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          );
        },
      },
      {
        accessorKey: "garmentDetails.brova",
        header: "Brova",
        cell: ({ row }) => {
          const { control } = useFormContext();
          return (
            <div className="flex items-center justify-center h-full w-full">
              <Controller
                name={`fabricSelections.${row.index}.garmentDetails.brova`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="mr-2"
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
