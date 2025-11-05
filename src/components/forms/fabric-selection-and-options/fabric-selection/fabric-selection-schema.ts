import { z } from "zod";
import { fabricSourceValues } from "../constants";

export const fabricSelectionSchema = z.object({
  id: z.string(),
  orderId: z.array(z.string()),
  fatoura: z.number().optional(),
  garmentId: z.string(),
  brova: z.boolean(),
  fabricSource: z.enum(fabricSourceValues),
  fabricId: z.string().optional(),
  shopName: z.string().optional(),
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
  express: z.boolean(),
  deliveryDate: z.union([z.date(), z.null()]),
  note: z.string(),
  fabricAmount: z.number(),
  homeDelivery: z.boolean(),
})
  .refine(
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
  )
  .refine(
    (data) => {
      // Express delivery requires home delivery
      if (data.express) {
        return data.homeDelivery;
      }
      return true;
    },
    {
      message: "Express delivery requires home delivery to be selected",
      path: ["express"],
    }
  )
  .refine(
    (data) => {
      // Home delivery requires a delivery date
      if (data.homeDelivery) {
        return data.deliveryDate !== null;
      }
      return true;
    },
    {
      message: "Delivery date is required when home delivery is selected",
      path: ["deliveryDate"],
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
  shopName: "",
  fabricLength: "",
  ifInside: "",
  color: "",
  measurementId: "",
  express: false,
  deliveryDate: null,
  note: "",
  fabricAmount: 0,
  homeDelivery: false,
};