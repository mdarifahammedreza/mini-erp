import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RefreshToken } from './schemas/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly rolesService;
    private readonly jwtService;
    private readonly configService;
    private readonly refreshTokenModel;
    constructor(usersService: UsersService, rolesService: RolesService, jwtService: JwtService, configService: ConfigService, refreshTokenModel: Model<RefreshToken>);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    refresh(refreshTokenStr: string, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    logout(refreshTokenStr: string): Promise<void>;
    register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto>;
    private hashToken;
}
