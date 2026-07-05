import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from '../sales/schemas/sale.schema';
import { Product } from '../products/schemas/product.schema';
import { Customer } from '../customers/schemas/customer.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<Sale>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
  ) {}

  async getOverviewStats(range: 'today' | '7days' | '30days' = '30days') {
    const now = new Date();
    const startDate = new Date();

    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '7days') {
      startDate.setDate(now.getDate() - 7);
    } else {
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

  async getSalesChartData(range: '7days' | '30days' = '30days') {
    const now = new Date();
    const startDate = new Date();

    if (range === '7days') {
      startDate.setDate(now.getDate() - 7);
    } else {
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
}
