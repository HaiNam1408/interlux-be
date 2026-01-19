import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import ApiResponse from 'src/global/api.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<any>;
    login(dto: LoginDto): Promise<ApiResponse<any>>;
    verifyEmail(token: string, email: string, res: Response): Promise<void>;
    refreshToken(dto: RefreshTokenDto): Promise<ApiResponse<any>>;
    resetRefreshToken(userId: number): Promise<ApiResponse<any>>;
    forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse<unknown>>;
    checkToken(token: string, email: string, res: Response): Promise<void>;
    resetPassword(body: ResetPasswordDto, res: Response): Promise<void>;
}
