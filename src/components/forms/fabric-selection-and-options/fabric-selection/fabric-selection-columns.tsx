"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type FabricSelectionSchema } from "./fabric-selection-schema";
import { Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as FabricCells from "./fabric-selection-cells";
import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { FabricPrintSummary } from "./fabric-print-component";

export const columns: ColumnDef<FabricSelectionSchema>[] = [
  // IDs
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
  // Fabric Selection
  {
    accessorKey: "fabricSource",
    header: "Source",
    minSize: 180,
    cell: FabricCells.FabricSourceCell,
  },
  {
    accessorKey: "ifInside",
    header: "Fabric",
    minSize: 200,
    cell: FabricCells.IfInsideCell,
  },
  {
    accessorKey: "shopName",
    header: "Shop Name",
    minSize: 150,
    cell: FabricCells.ShopNameCell,
  },
  {
    accessorKey: "color",
    header: "Color / اللون",
    minSize: 120,
    cell: FabricCells.ColorCell,
  },
  {
    accessorKey: "fabricLength",
    header: "Length (m)",
    minSize: 120,
    cell: FabricCells.FabricLengthCell,
  },
  {
    accessorKey: "fabricAmount",
    header: "Amount / سعر القماش",
    minSize: 160,
    cell: FabricCells.FabricAmountCell,
  },
  // Order Details
  {
    accessorKey: "brova",
    header: "Brova",
    minSize: 80,
    cell: FabricCells.BrovaCell,
  },
  {
    accessorKey: "express",
    header: "Express / مستعجل",
    minSize: 80,
    cell: FabricCells.ExpressCell,
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date / موعد التسليم",
    minSize: 150,
    cell: FabricCells.DeliveryDateCell,
  },
  {
    accessorKey: "homeDelivery",
    header: "Home Delivery",
    minSize: 120,
    cell: FabricCells.HomeDeliveryCell,
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
      const printRef = React.useRef<HTMLDivElement>(null);

      const handlePrint = useReactToPrint({
        contentRef: printRef,  // Pass ref directly (not a function)
        documentTitle: `Fabric-Order-${row.original.garmentId}`,
      });

      return (
        <>
          {/* Hidden print component */}
          <div style={{ display: "none" }}>
            <FabricPrintSummary
              ref={printRef}
              fabricData={row.original}
              orderNumber={row.original.garmentId}
            />
          </div>

          <Button variant="outline" onClick={handlePrint} size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </>
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
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isFormDisabled}
        >
          <Trash2 color="red" />
        </Button>
      );
    },
  },
];