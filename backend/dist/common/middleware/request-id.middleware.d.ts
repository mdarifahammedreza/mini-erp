import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
export declare class RequestIdMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: NextFunction): void;
}
