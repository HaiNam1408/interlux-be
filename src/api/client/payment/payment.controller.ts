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
import { CreatePaymentUrlDto, VerifyPaymentDto } from './dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Client - Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    @ApiOperation({ summary: 'Get payment details' })
    async getPaymentDetail(@Request() req, @Param('id') id: string) {
        const payment = await this.paymentService.getPaymentDetail(req.user.userId, +id);
        return ApiResponse.success({ payment });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('verify')
    @ApiOperation({ summary: 'Verify payment' })
    async verifyPayment(@Request() req, @Body() verifyPaymentDto: VerifyPaymentDto) {
        const payment = await this.paymentService.verifyPayment(req.user.userId, verifyPaymentDto);
        return ApiResponse.success({
            payment,
            message: 'Payment verified successfully',
        });
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('create-url')
    @ApiOperation({ summary: 'Create payment URL' })
    async createPaymentUrl(
        @Request() req,
        @Body() createPaymentUrlDto: CreatePaymentUrlDto
    ) {
        const { orderId, paymentMethod } = createPaymentUrlDto;
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const paymentData = await this.paymentService.createPaymentUrl(
            req.user.userId,
            orderId,
            paymentMethod,
            ipAddress
        );
        return ApiResponse.success({
            ...paymentData,
            message: 'Payment URL created successfully',
        });
    }

    @Public()
    @All('callback/:paymentMethod')
    @ApiOperation({ summary: 'Payment gateway callback' })
    async paymentCallback(
        @Param('paymentMethod') paymentMethod: string,
        @Query() query: any,
        @Body() body: any
    ) {
        const params = { ...query, ...body };
        const result = await this.paymentService.handlePaymentCallback(paymentMethod, params);
        return ApiResponse.success({
            ...result,
        });
    }

    @Public()
    @All('notify/:paymentMethod')
    @ApiOperation({ summary: 'Payment gateway notification webhook' })
    async paymentNotification(
        @Param('paymentMethod') paymentMethod: string,
        @Query() query: any,
        @Body() body: any
    ) {
        const params = { ...query, ...body };
        const result = await this.paymentService.handlePaymentCallback(paymentMethod, params);
        return ApiResponse.success({
            ...result,
        });
    }
}