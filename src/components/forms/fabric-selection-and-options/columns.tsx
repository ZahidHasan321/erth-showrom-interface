"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { optionStyleColumn } from "./columns/option-style-column";
import { garmentDetailsColumn } from "./columns/garment-details-column";
import { fabricDetailsColumn } from "./columns/fabric-details-column";
import { measurementsColumn } from "./columns/measurements-column";
import { styleGroupColumn } from "./columns/style-group-column";
import { totalAmountColumn } from "./columns/total-amount-column";
import { specialRequestColumn } from "./columns/special-request-column";
import { deleteActionColumn } from "./columns/delete-action-column";
import type { FabricSelectionSchema } from "./schema";

export const columns: ColumnDef<FabricSelectionSchema>[] = [
  ...optionStyleColumn,
  ...garmentDetailsColumn,
  ...fabricDetailsColumn,
  ...measurementsColumn,
  ...styleGroupColumn,
  ...totalAmountColumn,
  ...specialRequestColumn,
  ...deleteActionColumn,
];
