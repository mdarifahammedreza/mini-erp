import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from '../event-types';
import { StockLowPayload } from '../payloads/stock-low.payload';

@Injectable()
export class StockLowListener {
  @OnEvent(EventTypes.STOCK_LOW)
  async handleStockLow(_payload: StockLowPayload) {
    // TODO: Future Phase - BullMQ Integration
    // TODO: Future Phase - WebSocket Integration
  }
}
