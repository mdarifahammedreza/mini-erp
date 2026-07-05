import { SaleCreatedPayload } from '../payloads/sale-created.payload';
import { CacheService } from '../../cache/cache.service';
export declare class SaleCreatedListener {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    handleSaleCreated(_payload: SaleCreatedPayload): Promise<void>;
}
