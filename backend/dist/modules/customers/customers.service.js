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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
const sale_schema_1 = require("../sales/schemas/sale.schema");
let CustomersService = class CustomersService {
    customerModel;
    saleModel;
    constructor(customerModel, saleModel) {
        this.customerModel = customerModel;
        this.saleModel = saleModel;
    }
    async create(createDto) {
        if (createDto.email) {
            const existing = await this.customerModel.findOne({ email: createDto.email.toLowerCase() }).exec();
            if (existing) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const created = new this.customerModel({
            ...createDto,
            email: createDto.email ? createDto.email.toLowerCase() : undefined,
        });
        return created.save();
    }
    async findAll(queryOptions = {}) {
        const { page = 1, limit = 10, search } = queryOptions;
        const filter = {};
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
            ];
        }
        return this.customerModel.paginate({
            filter,
            page: Number(page),
            limit: Number(limit),
            sort: 'name',
        });
    }
    async findOne(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return customer;
    }
    async update(id, updateDto) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        if (updateDto.email && updateDto.email.toLowerCase() !== customer.email) {
            const existing = await this.customerModel.findOne({ email: updateDto.email.toLowerCase() }).exec();
            if (existing) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const updated = await this.customerModel
            .findByIdAndUpdate(id, {
            ...updateDto,
            email: updateDto.email ? updateDto.email.toLowerCase() : customer.email,
        }, { new: true })
            .exec();
        return updated;
    }
    async remove(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        const salesCount = await this.saleModel.countDocuments({ customer: id, deletedAt: null }).exec();
        if (salesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete customer with existing sales transactions');
        }
        await customer.softDelete();
        return customer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CustomersService);
//# sourceMappingURL=customers.service.js.map