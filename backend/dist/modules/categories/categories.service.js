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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schemas/category.schema");
const product_schema_1 = require("../products/schemas/product.schema");
let CategoriesService = class CategoriesService {
    categoryModel;
    productModel;
    constructor(categoryModel, productModel) {
        this.categoryModel = categoryModel;
        this.productModel = productModel;
    }
    async create(createDto) {
        const existing = await this.categoryModel.findOne({ name: createDto.name }).exec();
        if (existing) {
            throw new common_1.ConflictException('Category name already exists');
        }
        const created = new this.categoryModel(createDto);
        return created.save();
    }
    async findAll(queryOptions = {}) {
        const { page = 1, limit = 10, search } = queryOptions;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ];
        }
        return this.categoryModel.paginate({
            filter,
            page: Number(page),
            limit: Number(limit),
            sort: 'name',
        });
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateDto) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (updateDto.name && updateDto.name !== category.name) {
            const existing = await this.categoryModel.findOne({ name: updateDto.name }).exec();
            if (existing) {
                throw new common_1.ConflictException('Category name already exists');
            }
        }
        const updated = await this.categoryModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        return updated;
    }
    async remove(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        const productCount = await this.productModel.countDocuments({ category: id, deletedAt: null }).exec();
        if (productCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category with associated products');
        }
        await category.softDelete();
        return category;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map