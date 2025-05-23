import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { ValidateCouponDto } from './dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';

@ApiTags('Client - Coupon')
@Controller('coupon')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Post('validate')
    @ApiOperation({ summary: 'Validate coupon code' })
    async validateCoupon(@Request() req, @Body() validateCouponDto: ValidateCouponDto) {
        const result = await this.couponService.validateCoupon(req.user.userId, validateCouponDto);
        return ApiResponse.success({
            ...result,
            message: 'Mã giảm giá hợp lệ',
        });
    }

    @Get('available')
    @ApiOperation({ summary: 'Get available coupon codes' })
    async getAvailableCoupons() {
        const coupons = await this.couponService.getAvailableCoupons();
        return ApiResponse.success({ coupons });
    }
}