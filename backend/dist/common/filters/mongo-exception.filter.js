"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
let MongoExceptionFilter = class MongoExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Database error';
        let error = 'DatabaseError';
        if (exception.code === 11000) {
            status = common_1.HttpStatus.CONFLICT;
            const field = Object.keys(exception.keyPattern || {}).join(', ');
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            error = 'DuplicateKey';
        }
        else if (exception instanceof mongoose_1.Error.ValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = Object.values(exception.errors).map((e) => e.message).join(', ');
            error = 'ValidationError';
        }
        else if (exception instanceof mongoose_1.Error.CastError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = `Invalid format for field ${exception.path}`;
            error = 'CastError';
        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.MongoExceptionFilter = MongoExceptionFilter;
exports.MongoExceptionFilter = MongoExceptionFilter = __decorate([
    (0, common_1.Catch)(mongodb_1.MongoError, mongoose_1.Error.ValidationError, mongoose_1.Error.CastError)
], MongoExceptionFilter);
//# sourceMappingURL=mongo-exception.filter.js.map