"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = __importStar(require("joi"));
const app_config_1 = __importDefault(require("./app.config"));
const database_config_1 = __importDefault(require("./database.config"));
const jwt_config_1 = __importDefault(require("./jwt.config"));
const redis_config_1 = __importDefault(require("./redis.config"));
const upload_config_1 = __importDefault(require("./upload.config"));
const throttle_config_1 = __importDefault(require("./throttle.config"));
const cors_config_1 = __importDefault(require("./cors.config"));
const swagger_config_1 = __importDefault(require("./swagger.config"));
let ConfigModule = class ConfigModule {
};
exports.ConfigModule = ConfigModule;
exports.ConfigModule = ConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    app_config_1.default,
                    database_config_1.default,
                    jwt_config_1.default,
                    redis_config_1.default,
                    upload_config_1.default,
                    throttle_config_1.default,
                    cors_config_1.default,
                    swagger_config_1.default,
                ],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
                    PORT: Joi.number().default(5000),
                    API_PREFIX: Joi.string().default('api/v1'),
                    MONGO_URI: Joi.string().required(),
                    MONGO_USER: Joi.string().required(),
                    MONGO_PASSWORD: Joi.string().required(),
                    MONGO_DB: Joi.string().required(),
                    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
                    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
                    JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
                    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
                    REDIS_HOST: Joi.string().required(),
                    REDIS_PORT: Joi.number().default(6379),
                    REDIS_PASSWORD: Joi.string().allow('').default(''),
                    CORS_ORIGINS: Joi.string().default('http://localhost:5173'),
                    UPLOAD_DEST: Joi.string().default('./uploads/products'),
                    UPLOAD_MAX_SIZE: Joi.number().default(5242880),
                    THROTTLE_TTL: Joi.number().default(60000),
                    THROTTLE_LIMIT: Joi.number().default(100),
                }),
            }),
        ],
    })
], ConfigModule);
//# sourceMappingURL=config.module.js.map