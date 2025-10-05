import { type ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { type FabricSelection } from "@/types/fabric";

export const totalAmountColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Total Amount",
    id: "total_amount",
    cell: ({ row, table, column }) => (
      <Input
        type="number"
        value={row.original.total_amount}
        onChange={(e) =>
          table.options.meta?.updateData(row.index, column.id, e.target.value)
        }
      />
    ),
  },
];
