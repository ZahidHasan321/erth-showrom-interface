import { z } from "zod";

export const paymentTypeSchema = z
  .object({
    paymentType: z.enum(["k-net", "cash", "link-payment", "installments", "others"]),
    otherPaymentType: z.string().optional(),
    paymentRefNo: z.string().optional(),
    orderTaker: z.string().optional(),
  })
  .refine(
    (data) => {
      // If payment type is not cash, paymentRefNo is required
      if (data.paymentType !== "cash") {
        return data.paymentRefNo && data.paymentRefNo.trim().length > 0;
      }
      return true;
    },
    {
      message: "Payment reference number is required for non-cash payments",
      path: ["paymentRefNo"],
    }
  );

export type PaymentTypeSchema = z.infer<typeof paymentTypeSchema>;
