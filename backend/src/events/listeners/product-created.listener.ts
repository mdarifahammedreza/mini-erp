import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from '../event-types';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class ProductCreatedListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(EventTypes.PRODUCT_CREATED)
  async handleProductCreated() {
    await this.cacheService.invalidate('products:list');
    await this.cacheService.invalidate('dashboard:stats');
    // TODO: Future Phase - BullMQ Integration
  }
}
