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
exports.SaleSchema = exports.Sale = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
const customer_schema_1 = require("../../customers/schemas/customer.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
const sale_item_schema_1 = require("./sale-item.schema");
let Sale = class Sale extends mongoose_2.Document {
    invoiceNumber;
    customer;
    createdBy;
    items;
    grandTotal;
    notes;
    saleDate;
};
exports.Sale = Sale;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], Sale.prototype, "invoiceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Customer', required: true }),
    __metadata("design:type", customer_schema_1.Customer)
], Sale.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Sale.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [sale_item_schema_1.SaleItemSchema], required: true }),
    __metadata("design:type", Array)
], Sale.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "grandTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true, maxlength: 1000 }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Sale.prototype, "saleDate", void 0);
exports.Sale = Sale = __decorate([
    (0, mongoose_1.Schema)({ collection: 'sales' })
], Sale);
exports.SaleSchema = mongoose_1.SchemaFactory.createForClass(Sale);
exports.SaleSchema.plugin(plugins_1.timestampPlugin);
exports.SaleSchema.plugin(plugins_1.softDeletePlugin);
exports.SaleSchema.plugin(plugins_1.paginatePlugin);
exports.SaleSchema.plugin(plugins_1.toJSONPlugin);
exports.SaleSchema.path('items').validate(function (value) {
    return value && value.length > 0;
}, 'Sale must have at least one item');
exports.SaleSchema.index({ invoiceNumber: 1 });
exports.SaleSchema.index({ customer: 1, saleDate: -1 });
exports.SaleSchema.index({ createdBy: 1, saleDate: -1 });
exports.SaleSchema.index({ saleDate: -1 });
exports.SaleSchema.index({ deletedAt: 1, saleDate: -1 });
//# sourceMappingURL=sale.schema.js.map