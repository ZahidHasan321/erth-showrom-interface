"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { type FabricSelectionSchema } from "./fabric-selection-schema";
import { Button } from "@/components/ui/button";
import * as FabricCells from "./fabric-selection-cells";
import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { FabricLabel } from "./fabric-print-component";
import { useFormContext } from "react-hook-form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Printer, Trash2 } from "lucide-react";

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
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    minSize: 60,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        removeRow: (rowIndex: number) => void;
        isFormDisabled?: boolean;
        orderStatus?: "Pending" | "Completed" | "Cancelled";
        fatoura?: number;
        orderID?: string;
        customerId?: string;
        customerName?: string;
        customerMobile?: string;
        measurementOptions?: { id: string; MeasurementID: string }[];
      };

      const isFormDisabled = meta?.isFormDisabled ?? false;

      /* ---------- PRINT HOOKS ---------- */
      const printRef = React.useRef<HTMLDivElement>(null);
      const { getValues } = useFormContext();

      const orderID = meta?.orderID || "N/A";
      const customerId = meta?.customerId || "N/A";
      const customerName = meta?.customerName || "N/A";
      const customerMobile = meta?.customerMobile || "N/A";
      const measurementOptions = meta?.measurementOptions || [];

      const currentRowData = getValues(
        `fabricSelections.${row.index}`,
      ) as FabricSelectionSchema;
      const measurementDisplay =
        measurementOptions.find((m) => m.id === currentRowData.measurementId)
          ?.MeasurementID || currentRowData.measurementId;

      const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Fabric-Order-${currentRowData.garmentId}`,
        pageStyle: `
          @page { size: 5in 4in; margin: 0; }
          @media print {
            html,body{margin:0;padding:0;width:5in;height:4in;display:flex;align-items:center;justify-content:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
          }`,
      });

      const fabricData = {
        orderId: orderID,
        customerId,
        customerName,
        customerMobile,
        garmentId: currentRowData.garmentId || "",
        fabricSource: currentRowData.fabricSource || "",
        fabricId: currentRowData.fabricId || "",
        fabricLength: currentRowData.fabricLength || "",
        measurementId: measurementDisplay,
        brova: currentRowData.brova || false,
        express: currentRowData.express || false,
        deliveryDate: currentRowData.deliveryDate || null,
      };

      /* ---------- RENDER ---------- */
      return (
        <>
          {/* Hidden printable label */}
          <div style={{ display: "none" }}>
            <FabricLabel ref={printRef} fabricData={fabricData} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isFormDisabled}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handlePrint()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => meta?.removeRow(row.index)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
