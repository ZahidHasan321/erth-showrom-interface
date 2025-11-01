"use client";

import { type ColumnDef } from "@tanstack/react-table";

import type { StyleOptionsSchema } from "./style-options-schema";
import * as StyleCells from "./style-options-cells";

export const columns: ColumnDef<StyleOptionsSchema>[] = [
  {
    accessorKey: "garmentId",
    header: "Garment ID",
    minSize: 150,
    cell: StyleCells.GarmentIdCell,
  },
  {
    accessorKey: "styleOptionId",
    header: "Style Option Id",
    minSize: 100,
    cell: StyleCells.StyleOptionIdCell,
  },
  {
    accessorKey: "style",
    header: "Style",
    minSize: 150,
    cell: StyleCells.StyleCell,
  },
  {
    header: "Lines",
    id: "lines",
    minSize: 180,
    cell: StyleCells.LinesCell,
  },
  {
    accessorKey: "collar",
    header: "Collar",
    minSize: 350,
    cell: StyleCells.CollarCell,
  },
  {
    accessorKey: "jabzoor",
    header: "Jabzoor",
    minSize: 420,
    cell: StyleCells.JabzoorCell,
  },
  {
    accessorKey: "sidePocket",
    header: "Side Pocket",
    minSize: 360,
    cell: StyleCells.SidePocketCell,
  },
  {
    accessorKey: "frontPocket",
    header: "Front Pocket",
    minSize: 420,
    cell: StyleCells.FrontPocketCell,
  },
  {
    accessorKey: "cuffs",
    header: "Cuffs",
    minSize: 300,
    cell: StyleCells.CuffsCell,
  },
  {
    accessorKey: "extraAmount",
    header: "Extra Amount",
    minSize: 100,
    cell: StyleCells.ExtraAmountCell,
  },
];
