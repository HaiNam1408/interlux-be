import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import ApiResponse from 'src/global/api.response';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của người dùng' })
    async getCart(@Request() req) {
        const cart = await this.cartService.getOrCreateCart(req.user.id);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            summary
        });
    }

    @Post()
    @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
    async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
        const cart = await this.cartService.addToCart(req.user.id, addToCartDto);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            summary,
            message: 'Đã thêm sản phẩm vào giỏ hàng'
        });
    }

    @Put('item')
    @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng' })
    async updateCartItem(@Request() req, @Body() updateCartItemDto: UpdateCartItemDto) {
        const cart = await this.cartService.updateCartItem(req.user.id, updateCartItemDto);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            summary,
            message: 'Đã cập nhật giỏ hàng'
        });
    }

    @Delete('item/:id')
    @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
    async removeCartItem(@Request() req, @Param('id') cartItemId: string) {
        const cart = await this.cartService.removeCartItem(req.user.id, +cartItemId);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            summary,
            message: 'Đã xóa sản phẩm khỏi giỏ hàng'
        });
    }

    @Delete()
    @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng' })
    async clearCart(@Request() req) {
        const cart = await this.cartService.clearCart(req.user.id);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            summary,
            message: 'Đã xóa toàn bộ giỏ hàng'
        });
    }
}