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
exports.StockLowListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const event_types_1 = require("../event-types");
const stock_low_payload_1 = require("../payloads/stock-low.payload");
let StockLowListener = class StockLowListener {
    async handleStockLow(_payload) {
    }
};
exports.StockLowListener = StockLowListener;
__decorate([
    (0, event_emitter_1.OnEvent)(event_types_1.EventTypes.STOCK_LOW),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_low_payload_1.StockLowPayload]),
    __metadata("design:returntype", Promise)
], StockLowListener.prototype, "handleStockLow", null);
exports.StockLowListener = StockLowListener = __decorate([
    (0, common_1.Injectable)()
], StockLowListener);
//# sourceMappingURL=stock-low.listener.js.map