"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../../prisma.service");
const mail_service_1 = require("../../../services/mail/mail.service");
const crypto_1 = require("crypto");
const cache_manager_1 = require("@nestjs/cache-manager");
const template_util_1 = require("../../../utils/template.util");
const notification_service_1 = require("../../../services/notification/notification.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, mailService, notificationService, cacheService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.notificationService = notificationService;
        this.cacheService = cacheService;
    }
    async generateTokens(userId, email, role) {
        const accessToken = this.jwtService.sign({ userId, email, role }, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
        });
        const refreshToken = this.jwtService.sign({ userId }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
        });
        await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { refreshToken },
        });
        return { accessToken, refreshToken };
    }
    async register(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (user) {
            throw new common_1.HttpException("User already exists!", common_1.HttpStatus.BAD_REQUEST);
        }
        const existingCache = await this.cacheService.get(`register:${dto.email}`);
        if (existingCache) {
            throw new common_1.BadRequestException('Email has already been registered. Please check your email to verify.');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verifyToken = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.cacheService.set(`register:${dto.email}`, JSON.stringify({ ...dto, password: hashedPassword, verifyToken }), 5 * 60 * 1000);
        await this.mailService.sendVerificationEmail(dto.email, verifyToken, dto.username);
    }
    async verifyEmail(token, email) {
        const cachedUser = await this.cacheService.get(`register:${email}`);
        let error;
        if (!cachedUser) {
            error = 'Token expired or invalid';
        }
        let userData = null;
        if (!error) {
            const cacheData = JSON.parse(cachedUser);
            const { verifyToken, ...restUserData } = cacheData;
            if (verifyToken !== token) {
                error = 'Invalid token';
            }
            else {
                userData = restUserData;
            }
        }
        if (!error && userData) {
            const newUser = await this.prisma.user.create({ data: userData });
            await this.cacheService.del(`register:${email}`);
            await this.notificationService.createFromTemplate(newUser.id, 'ACCOUNT_CREATED', { username: newUser.username || newUser.email });
        }
        const data = {
            error,
            name: userData?.username || 'User',
            loginLink: `${process.env.CLIENT_URL}/login`
        };
        const html = await (0, template_util_1.renderTemplate)('register-response.ejs', data);
        return html;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user.id.toString(), user.email, user.role);
    }
    async refreshToken(refreshToken) {
        const decodeReToken = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.JWT_SECRET });
        const user = await this.prisma.user.findUnique({
            where: { id: decodeReToken.id }
        });
        if (!user || user.refreshToken !== refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const token = this.generateTokens(user.id.toString(), user.email, user.role);
        return token;
    }
    async resetRefreshToken(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new common_1.BadRequestException('Email does not exist');
        }
        const cacheKey = `reset-password:${dto.email}`;
        const existingToken = await this.cacheService.get(cacheKey);
        if (existingToken) {
            throw new common_1.BadRequestException('A reset password request was recently made. Please try again later.');
        }
        const resetToken = (0, crypto_1.randomBytes)(3).toString('hex').toUpperCase();
        await this.cacheService.set(cacheKey, resetToken, 3 * 60 * 1000);
        await this.mailService.sendForgotPasswordEmail(dto.email, resetToken, user.username);
    }
    async changePasswordPage(token, email) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new common_1.BadRequestException('Email does not exist');
            }
            const cacheKey = `reset-password:${email}`;
            const resetToken = await this.cacheService.get(cacheKey);
            if (!resetToken) {
                throw new common_1.BadRequestException('Reset token is invalid or has expired.');
            }
            if (resetToken !== token) {
                throw new common_1.BadRequestException('Reset token is invalid.');
            }
            const data = { token, email };
            const html = await (0, template_util_1.renderTemplate)('reset-password.ejs', data);
            return html;
        }
        catch (error) {
            const html = await (0, template_util_1.renderTemplate)('reset-password.ejs', {
                error: error.message || 'An unexpected error occurred'
            });
            return html;
        }
    }
    async resetPassword(dto) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (!user) {
                throw new common_1.BadRequestException('Email does not exist');
            }
            const cacheKey = `reset-password:${dto.email}`;
            const resetToken = await this.cacheService.get(cacheKey);
            if (!resetToken) {
                throw new common_1.BadRequestException('Reset token is invalid or has expired.');
            }
            if (resetToken !== dto.token) {
                throw new common_1.BadRequestException('Reset token is invalid.');
            }
            const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
            const updatedUser = await this.prisma.user.update({
                where: { email: dto.email },
                data: { password: hashedPassword },
            });
            await this.notificationService.createFromTemplate(updatedUser.id, 'PASSWORD_CHANGED', { username: updatedUser.username || updatedUser.email });
            const html = await (0, template_util_1.renderTemplate)('reset-password.ejs', {
                success: 'Password reset successfully, you can now log in with your new password.'
            });
            return html;
        }
        catch (error) {
            const html = await (0, template_util_1.renderTemplate)('reset-password.ejs', {
                error: error.message || 'An unexpected error occurred'
            });
            return html;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        notification_service_1.NotificationService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map