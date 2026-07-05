import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

@Catch(MongoError, MongooseError.ValidationError, MongooseError.CastError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'DatabaseError';

    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      const field = Object.keys(exception.keyPattern || {}).join(', ');
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      error = 'DuplicateKey';
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors).map((e: any) => e.message).join(', ');
      error = 'ValidationError';
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid format for field ${exception.path}`;
      error = 'CastError';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
