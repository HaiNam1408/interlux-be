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

@ApiTags('Client - Cart')
@Controller('cart')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get user\'s cart information' })
    async getCart(@Request() req) {
        const cart = await this.cartService.getOrCreateCart(req.user.userId);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            ...cart,
            summary
        });
    }

    @Post()
    @ApiOperation({ summary: 'Add product to cart' })
    async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
        const cart = await this.cartService.addToCart(req.user.userId, addToCartDto);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            ...cart,
            summary,
        }, 'Product added to cart successfully');
    }

    @Put('item')
    @ApiOperation({ summary: 'Update product quantity in cart' })
    async updateCartItem(@Request() req, @Body() updateCartItemDto: UpdateCartItemDto) {
        const cart = await this.cartService.updateCartItem(req.user.userId, updateCartItemDto);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            cart,
            ...summary,
        }, 'Cart updated successfully');
    }

    @Delete('item/:id')
    @ApiOperation({ summary: 'Remove product from cart' })
    async removeCartItem(@Request() req, @Param('id') cartItemId: string) {
        const cart = await this.cartService.removeCartItem(req.user.userId, +cartItemId);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            ...cart,
            summary,
        }, 'Product removed from cart successfully');
    }

    @Delete()
    @ApiOperation({ summary: 'Clear entire cart' })
    async clearCart(@Request() req) {
        const cart = await this.cartService.clearCart(req.user.userId);
        const summary = await this.cartService.getCartSummary(cart);
        return ApiResponse.success({
            ...cart,
            summary,
        }, 'Cart cleared successfully');
    }
}