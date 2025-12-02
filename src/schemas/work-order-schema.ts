import { z } from "zod";
import { FatouraStage } from "../types/stages";

export const orderSchema = z.object({
  // Fields from Order['fields']
  orderID: z.union([z.string(), z.number()]).optional().transform(val => val?.toString()),
  fatoura: z.coerce.number().optional(),
  fatouraStages: z.enum([
    FatouraStage.FATOURA_RECEIVED,
    FatouraStage.WATER,
    FatouraStage.BROVA_ON_PRODUCTION,
    FatouraStage.BROVA_AT_SHOP_WAITING_APPROVAL,
    FatouraStage.BROVA_OK,
    FatouraStage.BROVA_OK_ALT,
    FatouraStage.FINAL_ON_PRODUCTION,
    FatouraStage.FINAL_BROVA_AT_SHOP,
    FatouraStage.ALTERATION,
    FatouraStage.CANCELLED,
  ]).optional(),
  customerID: z.array(z.string()).optional(),
  orderDate: z.string().optional(),
  orderStatus: z.enum(["Pending", "Completed", "Cancelled"]),
  // orderTotal: z.number().optional(),
  notes: z.string().optional(),
  campaigns: z.array(z.string()).optional(),
  homeDelivery: z.boolean(),
  orderType: z.enum(["WORK", "SALES"]),
  paymentType: z
    .enum(["k-net", "cash", "link-payment", "installments", "others"])
    .optional(),
  paymentRefNo: z.string().optional(),
  orderTaker: z.string().optional(),
  discountType: z.enum(["flat", "referral", "loyalty", "byValue"]).optional(),
  discountPercentage: z.number().optional(),
  discountInKwd: z.string().optional(),
  referralCode: z.string().optional(),
  discountValue: z.number().optional(),
  charges: z.object({
    fabric: z.number(),
    stitching: z.number(),
    style: z.number(),
    delivery: z.number(),
    shelf: z.number(),
  }),
  advance: z.number().optional(),
  paid: z.number(),
  balance: z.number(),
  numOfFabrics: z.number(),
});

export const orderDefaults: OrderSchema = {
  orderID: undefined,
  orderStatus: "Pending",
  orderDate: new Date().toISOString(),
  fatouraStages: FatouraStage.FATOURA_RECEIVED,
  // orderTotal: 0,
  paymentType: "cash",
  orderType: "WORK",
  homeDelivery: false,
  discountValue: 0,
  charges: {
    fabric: 0,
    stitching: 0,
    style: 0,
    delivery: 0,
    shelf: 0,
  },
  advance: 0,
  paid: 0,
  balance: 0,
  numOfFabrics: 0,
};

export type OrderSchema = z.infer<typeof orderSchema>;
