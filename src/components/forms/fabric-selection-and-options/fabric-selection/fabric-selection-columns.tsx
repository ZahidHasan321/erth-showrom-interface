"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { type FabricSelectionSchema } from "./fabric-selection-schema";

import { Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as FabricCells from "./fabric-selection-cells";

export const columns: ColumnDef<FabricSelectionSchema>[] = [
  {
    accessorKey: "garmentId",
    header: "Garment ID",
    minSize: 100,
    cell: FabricCells.GarmentIdCell,
  },
  {
    accessorKey: "measurementId",
    header: "Measurement ID",
    minSize: 150,
    cell: FabricCells.MeasurementIdCell,
  },
  {
    accessorKey: "brova",
    header: "Brova",
    minSize: 80,
    cell: FabricCells.BrovaCell,
  },
  {
    accessorKey: "fabricSource",
    header: "Source",
    minSize: 180,
    cell: FabricCells.FabricSourceCell,
  },
  {
    accessorKey: "ifInside",
    header: "If inside",
    minSize: 200,
    cell: FabricCells.IfInsideCell,
  },
  {
    accessorKey: "color",
    header: "Color/ اللون",
    minSize: 120,
    cell: FabricCells.ColorCell,
  },
  {
    accessorKey: "fabricLength",
    header: "Fabric Length",
    minSize: 120,
    cell: FabricCells.FabricLengthCell,
  },
  {
    accessorKey: "express",
    header: "Express/مستعجل",
    minSize: 80,
    cell: FabricCells.ExpressCell,
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date/موعد التسليم",
    minSize: 150,
    cell: FabricCells.DeliveryDateCell,
  },
  {
    accessorKey: "fabricAmount",
    header: "Fabric Amount/سعر القماش",
    minSize: 160,
    cell: FabricCells.FabricAmountCell,
  },
  {
    accessorKey: "note",
    header: "Note",
    minSize: 150,
    cell: FabricCells.NoteCell,
  },
  {
    id: "print",
    header: "Print",
    minSize: 80,
    cell: ({ row }) => {
      const handlePrint = () => {
        // Add print logic here
        console.log("Printing row: ", row.original);
      };

      return (
        <Button variant='outline' onClick={handlePrint}>
          <Printer />
          Print
        </Button>
      );
    },
  },
  {
    id: "delete",
    minSize: 80,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        removeRow: (rowIndex: number) => void;
        isFormDisabled?: boolean;
      };
      const isFormDisabled = meta?.isFormDisabled || false;
      const handleDelete = () => {
        meta?.removeRow(row.index);
      };

      return (
        <Button
          variant='ghost'
          size='icon'
          onClick={handleDelete}
          disabled={isFormDisabled}
        >
          <Trash2 color='red' />
        </Button>
      );
    },
  },
];
