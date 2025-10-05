"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type FabricSelection } from "@/types/fabric";
import { optionStyleColumn } from "./columns/option-style-column";
import { garmentDetailsColumn } from "./columns/garment-details-column";
import { fabricDetailsColumn } from "./columns/fabric-details-column";
import { measurementsColumn } from "./columns/measurements-column";
import { styleGroupColumn } from "./columns/style-group-column";
import { totalAmountColumn } from "./columns/total-amount-column";
import { specialRequestColumn } from "./columns/special-request-column";

export const columns: ColumnDef<FabricSelection>[] = [
  ...optionStyleColumn,
  ...garmentDetailsColumn,
  ...fabricDetailsColumn,
  ...measurementsColumn,
  ...styleGroupColumn,
  ...totalAmountColumn,
  ...specialRequestColumn,
];
