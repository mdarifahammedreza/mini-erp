import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from '../event-types';
import { ProductUpdatedPayload } from '../payloads/product-updated.payload';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class ProductUpdatedListener {
  constructor(private readonly cacheService: CacheService) {}

  @OnEvent(EventTypes.PRODUCT_UPDATED)
  async handleProductUpdated(payload: ProductUpdatedPayload) {
    await this.cacheService.invalidate(`product:${payload.productId}`);
    await this.cacheService.invalidate('products:list');
    await this.cacheService.invalidate('dashboard:stats');
  }
}
