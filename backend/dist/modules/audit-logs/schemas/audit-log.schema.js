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
exports.AuditLogSchema = exports.AuditLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plugins_1 = require("../../../database/plugins");
const user_schema_1 = require("../../users/schemas/user.schema");
let AuditLog = class AuditLog extends mongoose_2.Document {
    userId;
    userEmail;
    action;
    module;
    description;
    previousData;
    newData;
    ipAddress;
    userAgent;
};
exports.AuditLog = AuditLog;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", user_schema_1.User)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'system', trim: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        enum: [
            'CREATE',
            'UPDATE',
            'DELETE',
            'RESTORE',
            'LOGIN',
            'LOGOUT',
            'LOGIN_FAILED',
            'PASSWORD_CHANGE',
            'ROLE_CHANGE',
            'EXPORT',
        ],
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        enum: ['users', 'roles', 'permissions', 'products', 'categories', 'customers', 'sales', 'auth', 'settings'],
    }),
    __metadata("design:type", String)
], AuditLog.prototype, "module", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true, maxlength: 500 }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, default: null }),
    __metadata("design:type", Object)
], AuditLog.prototype, "previousData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed, default: null }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, mongoose_1.Schema)({ collection: 'audit_logs', timestamps: { createdAt: true, updatedAt: false } })
], AuditLog);
exports.AuditLogSchema = mongoose_1.SchemaFactory.createForClass(AuditLog);
exports.AuditLogSchema.plugin(plugins_1.paginatePlugin);
exports.AuditLogSchema.plugin(plugins_1.toJSONPlugin);
exports.AuditLogSchema.index({ userId: 1, createdAt: -1 });
exports.AuditLogSchema.index({ module: 1, action: 1, createdAt: -1 });
exports.AuditLogSchema.index({ createdAt: -1 });
exports.AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });
//# sourceMappingURL=audit-log.schema.js.map