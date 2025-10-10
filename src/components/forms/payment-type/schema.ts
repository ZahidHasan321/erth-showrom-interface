import { z } from "zod";

export const paymentTypeSchema = z.object({
  paymentType: z.enum(["k-net", "cash", "link-payment", "installments", "others"]),
  otherPaymentType: z.string().optional(),
  paymentRefNo: z.string().optional(),
});

export type PaymentTypeSchema = z.infer<typeof paymentTypeSchema>;
