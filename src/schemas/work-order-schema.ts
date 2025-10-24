import { z } from "zod";

export const orderSchema = z.object({
  // Fields from Order['fields']
  orderID: z.string().optional(),
  customerID: z.array(z.string()).optional(),
  orderDate: z.string().optional(),
  orderStatus: z.enum(["Pending", "Completed", "Cancelled", "Processing"]),
  orderTotal: z.number().optional(),
  notes: z.string().optional(),
  campaigns: z.array(z.string()).optional(),

  // Fields from orderTypeAndPaymentSchema
  orderType: z.enum(["pickUp", "homeDelivery"]),
  paymentType: z
    .enum(["k-net", "cash", "link-payment", "installments", "others"])
    .optional(),
  discountType: z.enum(["flat", "referral", "loyalty"]).optional(),
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
  balance: z.number().optional(),
  numOfFabrics: z.number().optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;
