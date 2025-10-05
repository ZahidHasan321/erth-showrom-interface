import { type ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { type FabricSelection } from "@/types/fabric";

export const garmentDetailsColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Garment Details",
    id: "garment-details",
    meta: { className: "px-4" },
    columns: [
      {
        accessorKey: "garmentId",
        header: "Garment ID",
        cell: ({ row, table, column }) => (
          <Input
            value={row.original.garmentId}
            onChange={(e) =>
              table.options.meta?.updateData(
                row.index,
                column.id,
                e.target.value
              )
            }
          />
        ),
      },
      {
        accessorKey: "brova",
        header: "Brova",
        cell: ({ row, table, column }) => (
          <div className="flex items-center justify-center h-full w-full">
            <Checkbox
              className="mr-2"
              checked={row.original.brova}
              onCheckedChange={(value) =>
                table.options.meta?.updateData(row.index, column.id, !!value)
              }
            />
          </div>
        ),
      },
    ],
  },
];
