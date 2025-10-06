"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { type FabricSelectionSchema } from "../schema";
import {Trash2} from "lucide-react";

export const deleteActionColumn: ColumnDef<FabricSelectionSchema>[] = [
  {
    id: "delete",
    cell: ({ row, table }) => {
      const handleDelete = () => {
        table.options.meta?.removeRow(row.index);
      };

      return (
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className={"w-10 h-10"}/>
        </Button>
      );
    },
  },
];
