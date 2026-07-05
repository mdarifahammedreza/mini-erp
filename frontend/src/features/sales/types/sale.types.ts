import type { Customer } from '../../customers/types/customer.types';
import type { Product } from '../../products/types/product.types';

export interface SaleItem {
  product: string | Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  id: string;
  invoiceNumber: string;
  customer: string | Customer;
  items: SaleItem[];
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  soldBy: string;
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
  paymentMethod: 'cash' | 'card' | 'bank_transfer';
  notes?: string;
}
