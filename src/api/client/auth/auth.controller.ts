import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { renderTemplate } from 'src/utils/template.util';

@ApiBearerAuth()
    @ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Test Redis connection' })
    @Get('test-redis')
    async test(): Promise<any> {
        try {
            let abc = await this.authService.test();
            return {
                message: abc
            }
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Register a new user' })
    @UseInterceptors(CacheInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<any> {
        try {
            await this.authService.register(dto);
            return new ApiResponse<any>("Please check your email to verify", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'User login' })
    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const data = await this.authService.login(dto);
            return new ApiResponse<any>("User login successfully", HttpStatus.OK, data);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Verify user email' })
    @Get('verify-email')
    async verifyEmail(@Query('token') token: string, @Query('email') email: string, @Res() res: Response) {
        try {
            const html = await this.authService.verifyEmail(token, email);
            res.send(html);
        } catch (error) {
            const data = {
                error: 'Internal Server Error. Please try again later.',
                name: 'Guest',
                loginLink: `${process.env.CLIENT_URL}/login`
            };

            const html = await renderTemplate('register-response.ejs', data);
            res.send(html);
        }
    }

    @ApiOperation({ summary: 'Refresh authentication token' })
    @Post('refresh')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        try {
            const data = await this.authService.refreshToken(dto.refreshToken);
            return new ApiResponse<any>("Refresh token successfully", HttpStatus.OK, data);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Reset refresh token' })
    @Post('reset-refresh-token')
    async resetRefreshToken(@Body() userId: number) {
        try {
            await this.authService.resetRefreshToken(userId);
            return new ApiResponse<any>("Refresh token has been reset", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Request password reset' })
    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        try {
            await this.authService.forgotPassword(dto);
            return new ApiResponse("Please check your email to reset password", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Show password change page' })
    @Get('change-password')
    async checkToken(@Query('token') token: string, @Query('email') email: string, @Res() res: Response) {
        try {
            const html = await this.authService.changePasswordPage(token, email);
            res.send(html);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Reset user password' })
    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
        try {
            const html = await this.authService.resetPassword(body);
            res.send(html);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
