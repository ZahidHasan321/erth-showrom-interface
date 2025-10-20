import { z } from "zod";

export const orderSchema = z.object({
  // Fields from Order['fields']
  OrderID: z.string().optional(),
  CustomerID: z.array(z.string()).optional(),
  OrderDate: z.string().optional(),
  OrderStatus: z.enum(["Pending", "Processing", "Completed", "Cancelled"]),
  OrderTotal: z.number().optional(),
  Notes: z.string().optional(),
  Campaigns: z.array(z.string()).optional(),

  // Fields from orderTypeAndPaymentSchema
  orderType: z.enum(["pickUp", "homeDelivery"]),
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
});

export type OrderSchema = z.infer<typeof orderSchema>;
