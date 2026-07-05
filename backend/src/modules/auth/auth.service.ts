import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { RefreshToken } from './schemas/refresh-token.schema';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && await user.comparePassword(pass)) {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    }
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const payload = { email: user.email, sub: user._id || user.id };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN') || '15m') as any,
    });

    const refreshTokenString = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpiresInDays = parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7', 10);
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
    const role = populatedUser.role as any;
    const permissions = role?.permissions?.map((p: any) => p.slug) || [];

    return {
      accessToken,
      refreshToken: refreshTokenString,
      user: {
        id: populatedUser._id.toString(),
        email: populatedUser.email,
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
        fullName: (populatedUser as any).fullName,
        role: role?.slug || role,
        permissions,
        avatar: populatedUser.avatar || undefined,
      },
    };
  }

  async refresh(refreshTokenStr: string, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    const hashed = this.hashToken(refreshTokenStr);
    const dbToken = await this.refreshTokenModel.findOne({ token: hashed, isRevoked: false }).exec();

    if (!dbToken || dbToken.expiresAt.getTime() < Date.now()) {
      if (dbToken && dbToken.expiresAt.getTime() < Date.now()) {
        dbToken.isRevoked = true;
        await dbToken.save();
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    dbToken.isRevoked = true;
    await dbToken.save();

    const user = await this.usersService.findOne(dbToken.userId.toString());
    return this.login(user, ipAddress, userAgent);
  }

  async logout(refreshTokenStr: string): Promise<void> {
    const hashed = this.hashToken(refreshTokenStr);
    await this.refreshTokenModel.updateMany({ token: hashed }, { isRevoked: true }).exec();
  }

  async register(registerDto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const defaultRole = await this.rolesService.findBySlug('user');
    if (!defaultRole) {
      throw new BadRequestException('Default user role not configured');
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

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
