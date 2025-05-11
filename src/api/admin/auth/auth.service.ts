import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

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

    // Login
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (user.role !== Role.ADMIN) {
            throw new UnauthorizedException('Access denied. Admin privileges required.');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user.id.toString(), user.email, user.role);
    }

    async logout(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        
        return true;
    }
}
