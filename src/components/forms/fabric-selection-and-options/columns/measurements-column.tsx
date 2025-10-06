import { type ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type FabricSelection } from "@/types/fabric";

export const measurementsColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Measurements",
    id: "measurements",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "measurementId",
        header: "Measurement ID",
        cell: ({ row, table, column }) => (
          <Select
            onValueChange={(value) =>
              table.options.meta?.updateData(row.index, column.id, value)
            }
            value={row.original.measurementId}
          >
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
        ),
      },
      {
        accessorKey: "customize",
        header: "Customize",
        cell: ({ row, table, column }) => (
          <div className="w-full flex justify-center items-center">
            <Switch
              checked={row.original.customize}
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
