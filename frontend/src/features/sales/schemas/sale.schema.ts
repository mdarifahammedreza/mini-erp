import { z } from 'zod';

export const saleItemSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than zero').int('Quantity must be a whole number'),
});

export const saleSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  items: z.array(saleItemSchema).min(1, 'At least one product item is required'),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer']),
  notes: z.string().max(255).optional().or(z.literal('')),
});

export type SaleInput = z.infer<typeof saleSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;
