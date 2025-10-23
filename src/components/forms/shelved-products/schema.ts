import { z } from 'zod';

export const shelvedProductSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  productType: z.string(),
  brand: z.string(),
  quantity: z.number(), // Remove .default(1)
  Stock: z.number(),
  unitPrice: z.number(), // Remove .default(0)
});

export const shelvesFormSchema = z.object({
  products: z.array(shelvedProductSchema)
});

// Add this line to export the type
export type ShelvedProduct = z.infer<typeof shelvedProductSchema>;

export type ShelvesFormValues = z.infer<typeof shelvesFormSchema>;