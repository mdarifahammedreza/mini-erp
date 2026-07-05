"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("../sales/schemas/sale.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const customer_schema_1 = require("../customers/schemas/customer.schema");
let DashboardService = class DashboardService {
    saleModel;
    productModel;
    customerModel;
    constructor(saleModel, productModel, customerModel) {
        this.saleModel = saleModel;
        this.productModel = productModel;
        this.customerModel = customerModel;
    }
    async getOverviewStats(range = '30days') {
        const now = new Date();
        const startDate = new Date();
        if (range === 'today') {
            startDate.setHours(0, 0, 0, 0);
        }
        else if (range === '7days') {
            startDate.setDate(now.getDate() - 7);
        }
        else {
            startDate.setDate(now.getDate() - 30);
        }
        const salesStats = await this.saleModel.aggregate([
            { $match: { saleDate: { $gte: startDate }, deletedAt: null } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$grandTotal' },
                    salesCount: { $sum: 1 },
                    avgOrderValue: { $avg: '$grandTotal' },
                },
            },
        ]).exec();
        const stats = salesStats[0] || { totalRevenue: 0, salesCount: 0, avgOrderValue: 0 };
        const activeProducts = await this.productModel.countDocuments({ isActive: true, deletedAt: null }).exec();
        const activeCustomers = await this.customerModel.countDocuments({ isActive: true, deletedAt: null }).exec();
        const lowStockCount = await this.productModel.countDocuments({ stockQuantity: { $lt: 5 }, isActive: true, deletedAt: null }).exec();
        return {
            totalRevenue: stats.totalRevenue,
            salesCount: stats.salesCount,
            avgOrderValue: stats.avgOrderValue,
            activeProducts,
            activeCustomers,
            lowStockCount,
        };
    }
    async getLowStockAlerts() {
        return this.productModel
            .find({ stockQuantity: { $lt: 5 }, isActive: true, deletedAt: null })
            .populate('category')
            .limit(10)
            .exec();
    }
    async getTopSellingProducts(limit = 5) {
        return this.saleModel.aggregate([
            { $match: { deletedAt: null } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.productName' },
                    sku: { $first: '$items.productSku' },
                    unitPrice: { $first: '$items.unitPrice' },
                    totalQtySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.lineTotal' },
                },
            },
            { $sort: { totalQtySold: -1 } },
            { $limit: limit },
        ]).exec();
    }
    async getSalesChartData(range = '30days') {
        const now = new Date();
        const startDate = new Date();
        if (range === '7days') {
            startDate.setDate(now.getDate() - 7);
        }
        else {
            startDate.setDate(now.getDate() - 30);
        }
        return this.saleModel.aggregate([
            { $match: { saleDate: { $gte: startDate }, deletedAt: null } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
                    revenue: { $sum: '$grandTotal' },
                    salesCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]).exec();
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map