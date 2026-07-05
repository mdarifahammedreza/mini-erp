import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ValidationException } from '../filters/validation-exception.filter';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors: Record<string, string[]> = {};
        
        const formatError = (err: ValidationError, parentProperty = '') => {
          const property = parentProperty ? `${parentProperty}.${err.property}` : err.property;
          if (err.constraints) {
            formattedErrors[property] = Object.values(err.constraints);
          }
          if (err.children && err.children.length > 0) {
            err.children.forEach((child) => formatError(child, property));
          }
        };

        errors.forEach((err) => formatError(err));
        return new ValidationException(formattedErrors);
      },
    });
  }
}
