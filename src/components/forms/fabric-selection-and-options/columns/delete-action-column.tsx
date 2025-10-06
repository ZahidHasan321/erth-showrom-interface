"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type FabricSelectionSchema } from "../schema";

export const deleteActionColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    id: "delete",
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      );
    },
  },
];
