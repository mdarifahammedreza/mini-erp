import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(range?: 'today' | '7days' | '30days'): Promise<{
        totalRevenue: any;
        salesCount: any;
        avgOrderValue: any;
        activeProducts: number;
        activeCustomers: number;
        lowStockCount: number;
    }>;
    getLowStock(): Promise<(import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("../products/schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTopSelling(limit?: number): Promise<any[]>;
    getChartData(range?: '7days' | '30days'): Promise<any[]>;
}
