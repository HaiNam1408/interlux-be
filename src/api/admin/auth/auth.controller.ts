import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags("Admin - Auth")
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Admin login' })
    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            const data = await this.authService.login(dto);
            return new ApiResponse<any>("Admin login successfully", HttpStatus.OK, data);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Admin logout' })
    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@User() user: any) {
        try {
            await this.authService.logout(user.userId);
            return new ApiResponse<any>("Admin logout successfully", HttpStatus.OK);
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
