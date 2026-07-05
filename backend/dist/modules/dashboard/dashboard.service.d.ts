import { Model } from 'mongoose';
import { Sale } from '../sales/schemas/sale.schema';
import { Product } from '../products/schemas/product.schema';
import { Customer } from '../customers/schemas/customer.schema';
export declare class DashboardService {
    private readonly saleModel;
    private readonly productModel;
    private readonly customerModel;
    constructor(saleModel: Model<Sale>, productModel: Model<Product>, customerModel: Model<Customer>);
    getOverviewStats(range?: 'today' | '7days' | '30days'): Promise<{
        totalRevenue: any;
        salesCount: any;
        avgOrderValue: any;
        activeProducts: number;
        activeCustomers: number;
        lowStockCount: number;
    }>;
    getLowStockAlerts(): Promise<(import("mongoose").Document<unknown, {}, Product, {}, import("mongoose").DefaultSchemaOptions> & Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTopSellingProducts(limit?: number): Promise<any[]>;
    getSalesChartData(range?: '7days' | '30days'): Promise<any[]>;
}
