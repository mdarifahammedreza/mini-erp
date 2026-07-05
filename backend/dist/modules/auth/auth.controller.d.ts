import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    register(registerDto: RegisterDto, req: any): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    refresh(refreshDto: RefreshTokenDto, req: any): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    logout(refreshDto: RefreshTokenDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
