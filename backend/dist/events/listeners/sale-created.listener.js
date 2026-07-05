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
exports.SaleCreatedListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_types_1 = require("../event-types");
const sale_created_payload_1 = require("../payloads/sale-created.payload");
const cache_service_1 = require("../../cache/cache.service");
let SaleCreatedListener = class SaleCreatedListener {
    cacheService;
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async handleSaleCreated(_payload) {
        await this.cacheService.invalidate('dashboard:stats');
    }
};
exports.SaleCreatedListener = SaleCreatedListener;
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.EventTypes.SALE_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sale_created_payload_1.SaleCreatedPayload]),
    __metadata("design:returntype", Promise)
], SaleCreatedListener.prototype, "handleSaleCreated", null);
exports.SaleCreatedListener = SaleCreatedListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], SaleCreatedListener);
//# sourceMappingURL=sale-created.listener.js.map