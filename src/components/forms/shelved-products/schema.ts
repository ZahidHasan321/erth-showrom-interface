import { z } from 'zod';

export const shelvedProductSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  productType: z.string(),
  brand: z.string(),
  quantity: z.number().default(1),
  unitPrice: z.number().default(0),
});

export const shelvedProductsSchema = z.array(shelvedProductSchema);

export type ShelvedProduct = z.infer<typeof shelvedProductSchema>;
