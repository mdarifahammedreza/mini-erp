import type { Customer } from '../../customers/types/customer.types';
import type { Product } from '../../products/types/product.types';

export interface SaleItem {
  product: string | Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Sale {
  _id: string;
  id: string;
  invoiceNumber: string;
  customer: string | Customer;
  items: SaleItem[];
  grandTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSaleInput {
  customer: string;
  items: {
    product: string;
    quantity: number;
  }[];
  notes?: string;
}
