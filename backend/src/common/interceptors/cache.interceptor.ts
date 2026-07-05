import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = `http_cache:${url}`;
    const cachedResponse = (this.cacheService as any).cache.get(cacheKey);
    if (cachedResponse && cachedResponse.expiresAt > Date.now()) {
      return of(cachedResponse.value);
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheService.getOrSet(
          cacheKey,
          async () => response,
          60, // cache for 60s
        );
      }),
    );
  }
}
