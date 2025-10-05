import { type ColumnDef } from "@tanstack/react-table";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type FabricSelection } from "@/types/fabric";

export const fabricDetailsColumn: ColumnDef<FabricSelection>[] = [
  {
    header: "Fabric Details",
    id: "fabric-details",
    meta: { className: "bg-gray-100 px-4" },
    columns: [
      {
        accessorKey: "fabricSource",
        header: "Source",
        cell: ({ row, table, column }) => (
          <div className="flex flex-col space-y-1 w-[200px]">
            <Select
              onValueChange={(value) =>
                table.options.meta?.updateData(row.index, column.id, value)
              }
              value={row.original.fabricSource}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In">In</SelectItem>
                <SelectItem value="Out">Out</SelectItem>
              </SelectContent>
            </Select>
            {row.original.fabricSource === "In" && (
              <Combobox
                options={[
                  { value: "fabric1", label: "Fabric 1 ($10/m)" },
                  { value: "fabric2", label: "Fabric 2 ($12/m)" },
                ]}
                value={row.original.fabricCode}
                onChange={(value) =>
                  table.options.meta?.updateData(row.index, "fabricCode", value)
                }
                placeholder="Search fabric..."
              />
            )}
          </div>
        ),
      },
      {
        accessorKey: "fabricLength",
        header: "Fabric Length",
        cell: ({ row, table, column }) => (
          <Input
            value={row.original.fabricLength}
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
    ],
  },
];
