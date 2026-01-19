import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/services/mail/mail.service';
import { Cache } from 'cache-manager';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { NotificationService } from 'src/services/notification/notification.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    private notificationService;
    private cacheService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService, notificationService: NotificationService, cacheService: Cache);
    private generateTokens;
    register(dto: RegisterDto): Promise<void>;
    verifyEmail(token: string, email: string): Promise<string>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<any>;
    resetRefreshToken(userId: number): Promise<void>;
    forgotPassword(dto: ForgotPasswordDto): Promise<void>;
    changePasswordPage(token: string, email: string): Promise<string>;
    resetPassword(dto: ResetPasswordDto): Promise<string>;
}
