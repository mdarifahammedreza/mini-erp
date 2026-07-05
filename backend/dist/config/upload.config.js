"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('upload', () => ({
    dest: process.env.UPLOAD_DEST || './uploads/products',
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
}));
//# sourceMappingURL=upload.config.js.map