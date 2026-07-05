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
exports.CustomerSchema = exports.Customer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
let Customer = class Customer extends mongoose_2.Document {
    name;
    email;
    phone;
    address;
    isActive;
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true, trim: true, lowercase: true, maxlength: 100 }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, trim: true, maxlength: 20 }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isActive", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)({ collection: 'customers' })
], Customer);
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
exports.CustomerSchema.plugin(plugins_1.timestampPlugin);
exports.CustomerSchema.plugin(plugins_1.softDeletePlugin);
exports.CustomerSchema.plugin(plugins_1.paginatePlugin);
exports.CustomerSchema.plugin(plugins_1.toJSONPlugin);
exports.CustomerSchema.index({ email: 1 }, { unique: true, sparse: true });
exports.CustomerSchema.index({ isActive: 1, deletedAt: 1 });
exports.CustomerSchema.index({ name: 'text', email: 'text', phone: 'text' });
//# sourceMappingURL=customer.schema.js.map