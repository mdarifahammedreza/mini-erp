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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    eventEmitter;
    constructor(productModel, eventEmitter) {
        this.productModel = productModel;
        this.eventEmitter = eventEmitter;
    }
    async create(createDto) {
        const existing = await this.productModel.findOne({ sku: createDto.sku.toUpperCase() }).exec();
        if (existing) {
            throw new common_1.ConflictException(`Product with SKU ${createDto.sku} already exists`);
        }
        const created = new this.productModel({
            ...createDto,
            sku: createDto.sku.toUpperCase(),
        });
        const saved = await created.save();
        const populated = await this.findOne(saved._id.toString());
        this.eventEmitter.emit('product.created', populated);
        if (populated.stockQuantity < 5) {
            this.eventEmitter.emit('stock.low', {
                productId: populated._id.toString(),
                sku: populated.sku,
                name: populated.name,
                stockQuantity: populated.stockQuantity,
            });
        }
        return populated;
    }
    async findAll(queryOptions = {}) {
        const { page = 1, limit = 10, search, category, isActive, lowStock } = queryOptions;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { sku: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ];
        }
        if (category) {
            filter.category = category;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true' || isActive === true;
        }
        if (lowStock === 'true' || lowStock === true) {
            filter.stockQuantity = { $lt: 5 };
        }
        return this.productModel.paginate({
            filter,
            page: Number(page),
            limit: Number(limit),
            populate: 'category',
            sort: 'name',
        });
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).populate('category').exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySku(sku) {
        return this.productModel.findOne({ sku: sku.toUpperCase() }).populate('category').exec();
    }
    async update(id, updateDto) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (updateDto.sku && updateDto.sku.toUpperCase() !== product.sku) {
            const existing = await this.productModel.findOne({ sku: updateDto.sku.toUpperCase() }).exec();
            if (existing) {
                throw new common_1.ConflictException(`Product with SKU ${updateDto.sku} already exists`);
            }
        }
        const updated = await this.productModel
            .findByIdAndUpdate(id, {
            ...updateDto,
            sku: updateDto.sku ? updateDto.sku.toUpperCase() : product.sku,
        }, { new: true })
            .populate('category')
            .exec();
        this.eventEmitter.emit('product.updated', updated);
        if (updated.stockQuantity < 5) {
            this.eventEmitter.emit('stock.low', {
                productId: updated._id.toString(),
                sku: updated.sku,
                name: updated.name,
                stockQuantity: updated.stockQuantity,
            });
        }
        return updated;
    }
    async remove(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await product.softDelete();
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], ProductsService);
//# sourceMappingURL=products.service.js.map