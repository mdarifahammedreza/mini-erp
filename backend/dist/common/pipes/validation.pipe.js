"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const validation_exception_filter_1 = require("../filters/validation-exception.filter");
class CustomValidationPipe extends common_1.ValidationPipe {
    constructor() {
        super({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => {
                const formattedErrors = {};
                const formatError = (err, parentProperty = '') => {
                    const property = parentProperty ? `${parentProperty}.${err.property}` : err.property;
                    if (err.constraints) {
                        formattedErrors[property] = Object.values(err.constraints);
                    }
                    if (err.children && err.children.length > 0) {
                        err.children.forEach((child) => formatError(child, property));
                    }
                };
                errors.forEach((err) => formatError(err));
                return new validation_exception_filter_1.ValidationException(formattedErrors);
            },
        });
    }
}
exports.CustomValidationPipe = CustomValidationPipe;
//# sourceMappingURL=validation.pipe.js.map