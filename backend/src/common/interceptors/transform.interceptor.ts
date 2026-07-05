import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            timestamp: new Date().toISOString(),
            ...data,
          };
        }

        if (data && typeof data === 'object' && 'data' in data && 'pagination' in data) {
          return {
            success: true,
            data: data.data,
            pagination: data.pagination,
            timestamp: new Date().toISOString(),
          } as any;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
