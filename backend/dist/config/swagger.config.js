"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('swagger', () => ({
    title: 'Mini ERP API',
    description: 'The API documentation for Mini ERP application',
    version: '1.0',
    tag: 'mini-erp',
}));
//# sourceMappingURL=swagger.config.js.map