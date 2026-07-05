import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const id = uuidv4();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
