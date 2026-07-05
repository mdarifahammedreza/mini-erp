import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100),
  sku: z.string().min(1, 'SKU is required').max(50),
  description: z.string().max(500).optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  unitPrice: z.coerce.number().positive('Price must be greater than zero'),
  stockQuantity: z.coerce.number().nonnegative('Stock quantity must be zero or more'),
  minStockThreshold: z.coerce.number().nonnegative('Minimum stock threshold must be zero or more'),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
