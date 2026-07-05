export interface OverviewStats {
  totalRevenue: number;
  salesCount: number;
  avgOrderValue: number;
  activeProducts: number;
  activeCustomers: number;
  lowStockCount: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  sku: string;
  unitPrice: number;
  totalQtySold: number;
  totalRevenue: number;
}

export interface ChartDataItem {
  _id: string;
  revenue: number;
  salesCount: number;
}
