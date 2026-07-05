import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const errorResponse =
      exception instanceof HttpException && typeof exception.getResponse() === 'object'
        ? (exception.getResponse() as any)
        : { message };

    this.logger.error(
      `Method: ${request.method} URL: ${request.url} Status: ${status} Error: ${
        exception instanceof Error ? exception.stack : JSON.stringify(exception)
      }`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorResponse.message || message,
      error: errorResponse.error || 'Internal Server Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
