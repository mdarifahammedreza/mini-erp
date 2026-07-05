"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cors', () => ({
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
}));
//# sourceMappingURL=cors.config.js.map