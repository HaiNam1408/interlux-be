import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    Query,
    All,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { VerifyPaymentDto } from './dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get payment details' })
    async getPaymentDetail(@Request() req, @Param('id') id: string) {
        const payment = await this.paymentService.getPaymentDetail(req.user.id, +id);
        return ApiResponse.success({ payment });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('verify')
    @ApiOperation({ summary: 'Verify payment' })
    async verifyPayment(@Request() req, @Body() verifyPaymentDto: VerifyPaymentDto) {
        const payment = await this.paymentService.verifyPayment(req.user.id, verifyPaymentDto);
        return ApiResponse.success({
            payment,
            message: 'Thanh toán đã được xác nhận thành công',
        });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('create-url/:orderId')
    @ApiOperation({ summary: 'Create payment URL' })
    async createPaymentUrl(@Request() req, @Param('orderId') orderId: string) {
        const paymentData = await this.paymentService.createPaymentUrl(req.user.id, +orderId);
        return ApiResponse.success({
            ...paymentData,
            message: 'URL thanh toán đã được tạo thành công',
        });
    }

    @Public()
    @All('callback')
    @ApiOperation({ summary: 'Payment gateway callback' })
    async paymentCallback(@Query() query: any, @Body() body: any) {
        // Combine query and body to process the callback
        const params = { ...query, ...body };
        const result = await this.paymentService.handlePaymentCallback(params);
        return ApiResponse.success({
            ...result,
        });
    }
}