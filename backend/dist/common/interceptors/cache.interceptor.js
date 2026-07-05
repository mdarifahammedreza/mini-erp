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
exports.CacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_service_1 = require("../../cache/cache.service");
let CacheInterceptor = class CacheInterceptor {
    cacheService;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        if (method !== 'GET') {
            return next.handle();
        }
        const cacheKey = `http_cache:${url}`;
        const cachedResponse = this.cacheService.cache.get(cacheKey);
        if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
            return (0, rxjs_1.of)(cachedResponse.value);
        }
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            await this.cacheService.getOrSet(cacheKey, async () => response, 60);
        }));
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map