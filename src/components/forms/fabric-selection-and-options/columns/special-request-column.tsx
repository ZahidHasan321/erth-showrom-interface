import { type ColumnDef } from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea";
import { type FabricSelectionSchema } from "../schema";
import { useFormContext, Controller } from "react-hook-form";

export const specialRequestColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Special Request",
    id: "special_request",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.special_request`}
          control={control}
          render={({ field }) => <Textarea className="w-[300px]" {...field} />}
        />
      );
    },
  },
];
