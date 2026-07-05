import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number,  // seconds
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.value as T;
    }

    const data = await factory();
    this.cache.set(key, { value: data, expiresAt: now + ttl * 1000 });
    return data;
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(`^${pattern}`);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
