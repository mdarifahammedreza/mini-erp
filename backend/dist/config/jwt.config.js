"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET || 'super-secret-access-token-key-must-be-long-32-chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-must-be-long-32-chars',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
//# sourceMappingURL=jwt.config.js.map