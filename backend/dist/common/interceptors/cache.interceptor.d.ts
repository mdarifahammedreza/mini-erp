import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CacheService } from '../../cache/cache.service';
export declare class CacheInterceptor implements NestInterceptor {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
