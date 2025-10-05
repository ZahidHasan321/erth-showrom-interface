import { type ColumnDef } from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea";
import { type FabricSelection } from "@/types/fabric";

export const specialRequestColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Special Request",
    id: "special_request",
    cell: ({ row, table, column }) => (
      <Textarea
        className="w-[300px]"
        value={row.original.special_request}
        onChange={(e) =>
          table.options.meta?.updateData(row.index, column.id, e.target.value)
        }
      />
    ),
  },
];
