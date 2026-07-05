import { ExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common';
export declare class ValidationException extends BadRequestException {
    validationErrors: Record<string, string[]>;
    constructor(validationErrors: Record<string, string[]>);
}
export declare class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): void;
}
