export declare class CacheService {
    private cache;
    getOrSet<T>(key: string, factory: () => Promise<T>, ttl: number): Promise<T>;
    invalidate(pattern: string): Promise<void>;
    del(key: string): Promise<void>;
}
