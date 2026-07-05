import { CacheService } from '../../cache/cache.service';
export declare class ProductCreatedListener {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    handleProductCreated(): Promise<void>;
}
