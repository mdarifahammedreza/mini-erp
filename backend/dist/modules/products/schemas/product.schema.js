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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.Product = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
const category_schema_1 = require("../../categories/schemas/category.schema");
let Product = class Product extends mongoose_2.Document {
    name;
    sku;
    category;
    purchasePrice;
    sellingPrice;
    stockQuantity;
    image;
    description;
    isActive;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 200 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, uppercase: true, maxlength: 50 }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Category', required: true }),
    __metadata("design:type", category_schema_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "purchasePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "sellingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stockQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true, maxlength: 1000 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isActive", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ collection: 'products' })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.plugin(plugins_1.timestampPlugin);
exports.ProductSchema.plugin(plugins_1.softDeletePlugin);
exports.ProductSchema.plugin(plugins_1.paginatePlugin);
exports.ProductSchema.plugin(plugins_1.toJSONPlugin);
exports.ProductSchema.virtual('profitMargin').get(function () {
    if (this.purchasePrice === 0)
        return 100;
    return ((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100;
});
exports.ProductSchema.virtual('isLowStock').get(function () {
    return this.stockQuantity < 5;
});
exports.ProductSchema.index({ sku: 1 });
exports.ProductSchema.index({ category: 1, isActive: 1, deletedAt: 1 });
exports.ProductSchema.index({ stockQuantity: 1, isActive: 1, deletedAt: 1 });
exports.ProductSchema.index({ sellingPrice: 1 });
exports.ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
//# sourceMappingURL=product.schema.js.map