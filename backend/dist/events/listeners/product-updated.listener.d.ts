import { ProductUpdatedPayload } from '../payloads/product-updated.payload';
import { CacheService } from '../../cache/cache.service';
export declare class ProductUpdatedListener {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    handleProductUpdated(payload: ProductUpdatedPayload): Promise<void>;
}
