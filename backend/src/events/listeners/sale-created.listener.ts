import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from '../event-types';
import { SaleCreatedPayload } from '../payloads/sale-created.payload';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class SaleCreatedListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(EventTypes.SALE_CREATED)
  async handleSaleCreated(_payload: SaleCreatedPayload) {
    await this.cacheService.invalidate('dashboard:stats');
    // TODO: Future Phase - BullMQ Integration
    // TODO: Future Phase - WebSocket Integration
  }
}
