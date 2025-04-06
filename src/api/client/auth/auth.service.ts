import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { MailService } from 'src/services/mail/mail.service';
import { randomBytes } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { renderTemplate } from 'src/utils/template.util';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
        @Inject(CACHE_MANAGER) private cacheService: Cache
    ) { }

    // Generate Access Token & Refresh Token
    private async generateTokens(userId: string, email: string, role: string) {
        const accessToken = this.jwtService.sign(
            { userId, email, role },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
            },
        );
        const refreshToken = this.jwtService.sign(
            { userId },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
            },
        );

        await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    }

    async test() {
        console.log('===> START CACHE');
        let abc = await this.cacheService.get('abc');
        if (!abc) {
            await this.cacheService.set(`abc`, 'Hello');
            console.log('--------------> RECACHE');
            return abc;
        }
        console.log('===> END CACHE');
        return abc;
    }

    async register(dto: RegisterDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
        if (user) {
            throw new HttpException("User already exists!", HttpStatus.BAD_REQUEST);
        }

        const existingCache = await this.cacheService.get(`register:${dto.email}`);
        if (existingCache) {
            throw new BadRequestException('Email has already been registered. Please check your email to verify.');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verifyToken = randomBytes(32).toString('hex');

        await this.cacheService.set(
            `register:${dto.email}`,
            JSON.stringify({ ...dto, password: hashedPassword, verifyToken }),
            5 * 60 * 1000
        );

        await this.mailService.sendVerificationEmail(dto.email, verifyToken, dto.username);
    }


    async verifyEmail(token: string, email: string) {
        const cachedUser: string = await this.cacheService.get(`register:${email}`);
        if (!cachedUser) {
            throw new HttpException("Token invalid or expired!", HttpStatus.BAD_REQUEST);
        }

        const cacheData = JSON.parse(cachedUser);
        const { verifyToken, ...userData } = cacheData;
        if (verifyToken !== token) {
            throw new HttpException("Token invalid!", HttpStatus.BAD_REQUEST);
        }

        await this.prisma.user.create({ data: userData });
        await this.cacheService.del(`register:${email}`);
    }

    // Login
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user.id.toString(), user.email, user.role);
    }

    // Refresh Token
    async refreshToken(refreshToken: string): Promise<any> {
        const decodeReToken: any = await this.jwtService.verifyAsync(
            refreshToken,
            { secret: process.env.JWT_SECRET },
        );

        const user = await this.prisma.user.findUnique({
            where: { id: decodeReToken.id }
        });

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const token = this.generateTokens(user.id.toString(), user.email, user.role);

        return token;
    }

    // Reset Refresh Token
    async resetRefreshToken(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    // Forgot Password
    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new BadRequestException('Email does not exist');
        }

        const cacheKey = `reset-password:${dto.email}`;
        const existingToken = await this.cacheService.get(cacheKey);

        if (existingToken) {
            throw new BadRequestException('A reset password request was recently made. Please try again later.');
        }

        const resetToken = randomBytes(3).toString('hex').toUpperCase();
        await this.cacheService.set(cacheKey, resetToken, 3 * 60 * 1000);

        await this.mailService.sendForgotPasswordEmail(dto.email, resetToken, user.username);
    }

    // Reset Password Page
    async changePasswordPage(token: string, email: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new BadRequestException('Email does not exist');
            }

            const cacheKey = `reset-password:${email}`;
            const resetToken = await this.cacheService.get(cacheKey);

            if (!resetToken) {
                throw new BadRequestException('Reset token is invalid or has expired.');
            }

            if (resetToken !== token) {
                throw new BadRequestException('Reset token is invalid.');
            }

            const data = { token, email };
            const html = await renderTemplate('reset-password.ejs', data);

            return html;
        } catch (error) {
            const html = await renderTemplate('reset-password.ejs', {
                error: error.message || 'An unexpected error occurred'
            });
            return html;
        }
    }

    // Reset Password
    async resetPassword(dto: ResetPasswordDto) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (!user) {
                throw new BadRequestException('Email does not exist');
            }

            const cacheKey = `reset-password:${dto.email}`;
            const resetToken = await this.cacheService.get(cacheKey);

            if (!resetToken) {
                throw new BadRequestException('Reset token is invalid or has expired.');
            }

            if (resetToken !== dto.token) {
                throw new BadRequestException('Reset token is invalid.');
            }

            const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
            await this.prisma.user.update({
                where: { email: dto.email },
                data: { password: hashedPassword },
            });

            const html = await renderTemplate('reset-password.ejs', {
                success: 'Password reset successfully, you can now log in with your new password.'
            });

            return html;
        } catch (error) {
            const html = await renderTemplate('reset-password.ejs', {
                error: error.message || 'An unexpected error occurred'
            });
            return html;
        }
    }

}
