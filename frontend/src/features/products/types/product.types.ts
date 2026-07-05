export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string | Category;
  unitPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
