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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const sale_schema_1 = require("./schemas/sale.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const customer_schema_1 = require("../customers/schemas/customer.schema");
let SalesService = class SalesService {
    saleModel;
    productModel;
    customerModel;
    connection;
    eventEmitter;
    constructor(saleModel, productModel, customerModel, connection, eventEmitter) {
        this.saleModel = saleModel;
        this.productModel = productModel;
        this.customerModel = customerModel;
        this.connection = connection;
        this.eventEmitter = eventEmitter;
    }
    async create(createDto, userId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const customer = await this.customerModel.findById(createDto.customer).session(session).exec();
            if (!customer || !customer.isActive) {
                throw new common_1.BadRequestException('Customer not found or inactive');
            }
            const saleItems = [];
            let grandTotal = 0;
            for (const item of createDto.items) {
                const product = await this.productModel.findById(item.product).session(session).exec();
                if (!product || !product.isActive) {
                    throw new common_1.BadRequestException(`Product with ID ${item.product} not found or inactive`);
                }
                if (product.stockQuantity < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product: ${product.name}. Requested: ${item.quantity}, Available: ${product.stockQuantity}`);
                }
                const lineTotal = product.sellingPrice * item.quantity;
                grandTotal += lineTotal;
                saleItems.push({
                    product: product._id,
                    productName: product.name,
                    productSku: product.sku,
                    unitPrice: product.sellingPrice,
                    quantity: item.quantity,
                    lineTotal,
                });
            }
            for (const item of createDto.items) {
                const updatedProduct = await this.productModel.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } }, { new: true, session }).exec();
                if (updatedProduct && updatedProduct.stockQuantity < 5) {
                    this.eventEmitter.emit('stock.low', {
                        productId: updatedProduct._id.toString(),
                        sku: updatedProduct.sku,
                        name: updatedProduct.name,
                        stockQuantity: updatedProduct.stockQuantity,
                    });
                }
            }
            const invoiceNumber = await this.generateInvoiceNumber(session);
            const saleDate = createDto.saleDate ? new Date(createDto.saleDate) : new Date();
            const newSaleDocs = await this.saleModel.create([
                {
                    invoiceNumber,
                    customer: customer._id,
                    createdBy: userId,
                    items: saleItems,
                    grandTotal,
                    notes: createDto.notes || '',
                    saleDate,
                },
            ], { session });
            const newSale = newSaleDocs[0];
            await session.commitTransaction();
            const populatedSale = await this.findOne(newSale._id.toString());
            this.eventEmitter.emit('sale.created', populatedSale);
            return populatedSale;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async findAll(queryOptions = {}) {
        const { page = 1, limit = 10, search, customer, createdBy, startDate, endDate } = queryOptions;
        const filter = {};
        if (search) {
            filter.$or = [
                { invoiceNumber: new RegExp(search, 'i') },
                { notes: new RegExp(search, 'i') },
            ];
        }
        if (customer) {
            filter.customer = customer;
        }
        if (createdBy) {
            filter.createdBy = createdBy;
        }
        if (startDate || endDate) {
            filter.saleDate = {};
            if (startDate) {
                filter.saleDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.saleDate.$lte = new Date(endDate);
            }
        }
        return this.saleModel.paginate({
            filter,
            page: Number(page),
            limit: Number(limit),
            populate: ['customer', 'createdBy'],
            sort: '-saleDate',
        });
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate(['customer', 'createdBy']).exec();
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        return sale;
    }
    async remove(id) {
        const sale = await this.saleModel.findById(id).exec();
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        await sale.softDelete();
        return sale;
    }
    async generateInvoiceNumber(session) {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const count = await this.saleModel.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        }).session(session).exec();
        const sequentialStr = String(count + 1).padStart(4, '0');
        return `INV-${dateStr}-${sequentialStr}`;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        event_emitter_1.EventEmitter2])
], SalesService);
//# sourceMappingURL=sales.service.js.map