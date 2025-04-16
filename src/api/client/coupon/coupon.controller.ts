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

@ApiTags('Coupon')
@Controller('coupon')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Post('validate')
    @ApiOperation({ summary: 'Kiểm tra tính hợp lệ của mã giảm giá' })
    async validateCoupon(@Request() req, @Body() validateCouponDto: ValidateCouponDto) {
        const result = await this.couponService.validateCoupon(req.user.id, validateCouponDto);
        return ApiResponse.success({
            ...result,
            message: 'Mã giảm giá hợp lệ',
        });
    }

    @Get('available')
    @ApiOperation({ summary: 'Lấy danh sách mã giảm giá có sẵn' })
    async getAvailableCoupons() {
        const coupons = await this.couponService.getAvailableCoupons();
        return ApiResponse.success({ coupons });
    }
}