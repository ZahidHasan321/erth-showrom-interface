import { type ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { type FabricSelectionSchema } from "../schema";
import { useFormContext, Controller } from "react-hook-form";

export const totalAmountColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    header: "Total Amount",
    id: "total_amount",
    cell: ({ row }) => {
      const { control } = useFormContext();
      return (
        <Controller
          name={`fabricSelections.${row.index}.total_amount`}
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
      );
    },
  },
];
