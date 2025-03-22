import {
    HttpException,
    HttpStatus,
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

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    // Tạo Access Token & Refresh Token
    private async generateTokens(userId: string, email: string) {
        const accessToken = this.jwtService.sign(
            { userId, email },
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

    // Đăng ký tài khoản
    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verificationToken = randomBytes(32).toString('hex');

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                phone: dto.phone,
                password: hashedPassword,
                verificationToken,
            },
        });

        await this.mailService.sendVerificationEmail(user.email, verificationToken, user.username);
    }

    async verifyEmail(token: string) {
        const user = await this.prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new HttpException('Token invalid!', HttpStatus.BAD_REQUEST);
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
        });

        return { message: 'Verify email successfully!' };
    }

    // Đăng nhập
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isVerified) {
            throw new HttpException('Your account is not verified!', HttpStatus.FORBIDDEN);
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user.id.toString(), user.email);
    }

    // Refresh Token
    async refreshToken(refreshToken: string): Promise<any> {
        const decodeReToken: any = await this.jwtService.verifyAsync(
            refreshToken,
            {
                secret: process.env.JWT_SECRET_KEY,
            },
        );

        const user = await this.prisma.user.findUnique({
            where: { id: decodeReToken.id }
        });

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const token = this.generateTokens(user.id.toString(), user.email);

        return token;
    }

    // Reset Refresh Token
    async resetRefreshToken(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
}
