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
exports.RoleSchema = exports.Role = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
let Role = class Role extends mongoose_2.Document {
    name;
    slug;
    description;
    permissions;
    isSystem;
    isActive;
};
exports.Role = Role;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, maxlength: 50 }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, lowercase: true, maxlength: 50 }),
    __metadata("design:type", String)
], Role.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true, maxlength: 255 }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Permission' }], default: [] }),
    __metadata("design:type", Array)
], Role.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Role.prototype, "isSystem", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Role.prototype, "isActive", void 0);
exports.Role = Role = __decorate([
    (0, mongoose_1.Schema)({ collection: 'roles' })
], Role);
exports.RoleSchema = mongoose_1.SchemaFactory.createForClass(Role);
exports.RoleSchema.plugin(plugins_1.timestampPlugin);
exports.RoleSchema.plugin(plugins_1.softDeletePlugin);
exports.RoleSchema.plugin(plugins_1.paginatePlugin);
exports.RoleSchema.plugin(plugins_1.toJSONPlugin);
exports.RoleSchema.pre('validate', function () {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
});
exports.RoleSchema.index({ isActive: 1, deletedAt: 1 });
//# sourceMappingURL=role.schema.js.map