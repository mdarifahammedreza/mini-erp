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
exports.PermissionSchema = exports.Permission = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
let Permission = class Permission extends mongoose_2.Document {
    name;
    slug;
    module;
    action;
    description;
    isActive;
};
exports.Permission = Permission;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, maxlength: 100 }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, lowercase: true, maxlength: 100 }),
    __metadata("design:type", String)
], Permission.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        maxlength: 50,
        enum: ['users', 'roles', 'permissions', 'products', 'categories', 'customers', 'sales', 'dashboard', 'audit-logs', 'settings'],
    }),
    __metadata("design:type", String)
], Permission.prototype, "module", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        maxlength: 50,
        enum: ['create', 'read', 'update', 'delete', 'manage', 'export'],
    }),
    __metadata("design:type", String)
], Permission.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true, maxlength: 255 }),
    __metadata("design:type", String)
], Permission.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "isActive", void 0);
exports.Permission = Permission = __decorate([
    (0, mongoose_1.Schema)({ collection: 'permissions' })
], Permission);
exports.PermissionSchema = mongoose_1.SchemaFactory.createForClass(Permission);
exports.PermissionSchema.plugin(plugins_1.timestampPlugin);
exports.PermissionSchema.plugin(plugins_1.softDeletePlugin);
exports.PermissionSchema.plugin(plugins_1.paginatePlugin);
exports.PermissionSchema.plugin(plugins_1.toJSONPlugin);
exports.PermissionSchema.index({ module: 1, action: 1 }, { unique: true });
exports.PermissionSchema.index({ isActive: 1, deletedAt: 1 });
//# sourceMappingURL=permission.schema.js.map