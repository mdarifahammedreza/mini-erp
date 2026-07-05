import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProductUpdatedListener } from './listeners/product-updated.listener';
import { ProductCreatedListener } from './listeners/product-created.listener';
import { SaleCreatedListener } from './listeners/sale-created.listener';
import { StockLowListener } from './listeners/stock-low.listener';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    ProductUpdatedListener,
    ProductCreatedListener,
    SaleCreatedListener,
    StockLowListener,
  ],
})
export class EventsModule {}
