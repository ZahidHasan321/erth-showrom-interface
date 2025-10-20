import { z } from "zod";
import { fabricSourceValues } from "../constants";

export const fabricSelectionSchema = z.object({
  id: z.string(),
  orderId: z.array(z.string()),
  garmentId: z.string().min(1, "Garment ID is required"),
  brova: z.boolean(),
  fabricSource: z.enum(fabricSourceValues),
  fabricId: z.string().min(1, "Fabric is required"),
  fabricLength: z.string().min(1, "Length is required"),
  ifInside: z.string().optional(),
  color: z.string().optional(),
  measurementId: z.string().min(1, "Measurement ID is required"),
  express: z.boolean().optional(),
  deliveryDate: z.date().optional(),
  special_request: z.string().optional(),
  note: z.string().optional(),
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
  deliveryDate: undefined,
  special_request: "",
  note: "",
};
