import { z } from "zod";

export const orderSchema = z.object({
  // Fields from Order['fields']
  orderID: z.string().optional(),
  fatoura: z.coerce.number().optional(),
  customerID: z.array(z.string()).optional(),
  orderDate: z.string().optional(),
  orderStatus: z.enum(["Pending", "Completed", "Cancelled"]),
  // orderTotal: z.number().optional(),
  notes: z.string().optional(),
  campaigns: z.array(z.string()).optional(),

  orderType: z.enum(["pickUp", "homeDelivery"]),
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
  orderStatus: "Pending",
  orderDate: new Date().toISOString(),
  // orderTotal: 0,
  paymentType: "cash",
  orderType: "pickUp",
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
