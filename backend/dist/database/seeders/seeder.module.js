"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const permission_schema_1 = require("../../modules/permissions/schemas/permission.schema");
const role_schema_1 = require("../../modules/roles/schemas/role.schema");
const user_schema_1 = require("../../modules/users/schemas/user.schema");
const category_schema_1 = require("../../modules/categories/schemas/category.schema");
const product_schema_1 = require("../../modules/products/schemas/product.schema");
const customer_schema_1 = require("../../modules/customers/schemas/customer.schema");
const seeder_service_1 = require("./seeder.service");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: permission_schema_1.Permission.name, schema: permission_schema_1.PermissionSchema },
                { name: role_schema_1.Role.name, schema: role_schema_1.RoleSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: customer_schema_1.Customer.name, schema: customer_schema_1.CustomerSchema },
            ]),
        ],
        providers: [seeder_service_1.SeederService],
        exports: [seeder_service_1.SeederService],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map