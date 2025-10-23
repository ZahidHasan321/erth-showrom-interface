import { z } from "zod";
import { fabricSourceValues } from "../constants";

export const fabricSelectionSchema = z.object({
  id: z.string(),
  orderId: z.array(z.string()),
  garmentId: z.string(),
  brova: z.boolean(),
  fabricSource: z.enum(fabricSourceValues),
  fabricId: z.string(),
  fabricLength: z.string(),
  ifInside: z.string().optional(),
  color: z.string(),
  measurementId: z.string(),
  express: z.boolean().optional(),
  deliveryDate: z.date().optional().nullable(),
  note: z.string().optional(),
  fabricAmount: z.number().optional()
});

export type FabricSelectionSchema = z.infer<typeof fabricSelectionSchema>;

export const fabricSelectionDefaults: FabricSelectionSchema = {
  id: "",
  orderId: [],
  garmentId: "",
  brova: false,
  fabricSource: "",
  fabricId: "",
  fabricLength: "",
  ifInside: "",
  color: "",
  measurementId: "",
  express: false,
  deliveryDate: null,
  note: "",
};
