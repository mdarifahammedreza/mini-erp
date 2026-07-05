import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, string[]>) {
    super(validationErrors);
  }
}

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      errors: exception.validationErrors,
      error: 'ValidationError',
      timestamp: new Date().toISOString(),
    });
  }
}
