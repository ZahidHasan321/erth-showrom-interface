import { z } from "zod";
import { fabricSourceValues } from "../constants";
import { PieceStage } from "@/types/stages";

const PIECE_STAGE_VALUES = Object.values(PieceStage) as [string, ...string[]];

export const fabricSelectionSchema = z.object({
  id: z.string(),
  orderId: z.array(z.string()),
  fatoura: z.number().optional(),
  garmentId: z.string(),
  pieceStage: z.enum(PIECE_STAGE_VALUES).optional(),
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
  deliveryDate: z.date({
    error: "Delivery date is required",
  }),
  note: z.string(),
  fabricAmount: z.number(),
  homeDelivery: z.boolean(),
})
  .refine(
    (data) => {
      // If source is "IN", fabricId is required
      if (data.fabricSource === "IN") {
        return data.fabricId && data.fabricId.length > 0;
      }
      return true;
    },
    {
      message: "Fabric selection is required when source is 'IN'",
      path: ["fabricId"],
    }
  )
  .refine(
    (data) => {
      // If brova is true, homeDelivery must be false
      if (data.brova) {
        return !data.homeDelivery;
      }
      return true;
    },
    {
      message: "Home delivery is not available for brova fabrics",
      path: ["homeDelivery"],
    }
  );

export type FabricSelectionSchema = z.infer<typeof fabricSelectionSchema>;

export const fabricSelectionDefaults: FabricSelectionSchema = {
  id: "",
  orderId: [],
  garmentId: "",
  pieceStage: PieceStage.GarmentAtShop,
  brova: false,
  fabricSource: "",
  fabricId: "",
  shopName: "",
  fabricLength: "",
  ifInside: "",
  color: "",
  measurementId: "",
  express: false,
  deliveryDate: new Date(),
  note: "",
  fabricAmount: 0,
  homeDelivery: false,
};
