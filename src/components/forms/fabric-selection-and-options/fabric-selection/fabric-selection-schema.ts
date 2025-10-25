import { z } from "zod";
import { fabricSourceValues } from "../constants";

export const fabricSelectionSchema = z.object({
  id: z.string(),
  orderId: z.array(z.string()),
  garmentId: z.string(),
  brova: z.boolean(),
  fabricSource: z.enum(fabricSourceValues),
  fabricId: z.string().optional(),
  fabricLength: z.string().refine(
    (val) => {
      if (!val) return false;
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Fabric length must be a positive number" }
  ),
  ifInside: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  measurementId: z.string().min(1, "Measurement ID is required"),
  express: z.boolean().optional(),
  deliveryDate: z.date().optional().nullable(),
  note: z.string().optional(),
  fabricAmount: z.number().optional(),
}).refine(
  (data) => {
    // If source is "In", fabricId is required
    if (data.fabricSource === "In") {
      return data.fabricId && data.fabricId.length > 0;
    }
    return true;
  },
  {
    message: "Fabric selection is required when source is 'In'",
    path: ["fabricId"],
  }
);

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