"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const product_updated_listener_1 = require("./listeners/product-updated.listener");
const product_created_listener_1 = require("./listeners/product-created.listener");
const sale_created_listener_1 = require("./listeners/sale-created.listener");
const stock_low_listener_1 = require("./listeners/stock-low.listener");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [event_emitter_1.EventEmitterModule.forRoot()],
        providers: [
            product_updated_listener_1.ProductUpdatedListener,
            product_created_listener_1.ProductCreatedListener,
            sale_created_listener_1.SaleCreatedListener,
            stock_low_listener_1.StockLowListener,
        ],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map