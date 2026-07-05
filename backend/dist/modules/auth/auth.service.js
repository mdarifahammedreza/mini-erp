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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const crypto = __importStar(require("crypto"));
const users_service_1 = require("../users/users.service");
const roles_service_1 = require("../roles/roles.service");
const refresh_token_schema_1 = require("./schemas/refresh-token.schema");
let AuthService = class AuthService {
    usersService;
    rolesService;
    jwtService;
    configService;
    refreshTokenModel;
    constructor(usersService, rolesService, jwtService, configService, refreshTokenModel) {
        this.usersService = usersService;
        this.rolesService = rolesService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.refreshTokenModel = refreshTokenModel;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmailWithPassword(email);
        if (user && await user.comparePassword(pass)) {
            const userObj = user.toObject();
            delete userObj.password;
            return userObj;
        }
        return null;
    }
    async login(user, ipAddress, userAgent) {
        const payload = { email: user.email, sub: user._id || user.id };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: (this.configService.get('JWT_EXPIRES_IN') || '15m'),
        });
        const refreshTokenString = crypto.randomBytes(40).toString('hex');
        const refreshTokenExpiresInDays = parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7', 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + refreshTokenExpiresInDays);
        const newRefreshToken = new this.refreshTokenModel({
            userId: user._id || user.id,
            token: this.hashToken(refreshTokenString),
            ipAddress,
            userAgent,
            expiresAt,
        });
        await newRefreshToken.save();
        const populatedUser = await this.usersService.findOne(user._id || user.id);
        const role = populatedUser.role;
        const permissions = role?.permissions?.map((p) => p.slug) || [];
        return {
            accessToken,
            refreshToken: refreshTokenString,
            user: {
                id: populatedUser._id.toString(),
                email: populatedUser.email,
                firstName: populatedUser.firstName,
                lastName: populatedUser.lastName,
                fullName: populatedUser.fullName,
                role: role?.slug || role,
                permissions,
                avatar: populatedUser.avatar || undefined,
            },
        };
    }
    async refresh(refreshTokenStr, ipAddress, userAgent) {
        const hashed = this.hashToken(refreshTokenStr);
        const dbToken = await this.refreshTokenModel.findOne({ token: hashed, isRevoked: false }).exec();
        if (!dbToken || dbToken.expiresAt.getTime() < Date.now()) {
            if (dbToken && dbToken.expiresAt.getTime() < Date.now()) {
                dbToken.isRevoked = true;
                await dbToken.save();
            }
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        dbToken.isRevoked = true;
        await dbToken.save();
        const user = await this.usersService.findOne(dbToken.userId.toString());
        return this.login(user, ipAddress, userAgent);
    }
    async logout(refreshTokenStr) {
        const hashed = this.hashToken(refreshTokenStr);
        await this.refreshTokenModel.updateMany({ token: hashed }, { isRevoked: true }).exec();
    }
    async register(registerDto, ipAddress, userAgent) {
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new common_1.BadRequestException('Passwords do not match');
        }
        const defaultRole = await this.rolesService.findBySlug('user');
        if (!defaultRole) {
            throw new common_1.BadRequestException('Default user role not configured');
        }
        const createdUser = await this.usersService.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
            password: registerDto.password,
            role: defaultRole._id.toString(),
            isActive: true,
        });
        return this.login(createdUser, ipAddress, userAgent);
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(refresh_token_schema_1.RefreshToken.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        roles_service_1.RolesService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map