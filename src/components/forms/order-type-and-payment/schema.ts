"use client";
import { z } from "zod";

export const orderTypeAndPaymentSchema = z
  .object({
    orderType: z.enum(["pickUp", "homeDelivery"]),
    discountType: z.enum(["flat", "referral", "loyalty"]).optional(),
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
    balance: z.number().optional(),
  })

export const orderTypeAndPaymentDefaults: OrderTypeAndPaymentSchema = {
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
  balance: 0,
};

export type OrderTypeAndPaymentSchema = z.infer<
  typeof orderTypeAndPaymentSchema
>;
