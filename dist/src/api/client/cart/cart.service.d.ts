import { PrismaService } from '../../../prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCart(userId: number): Promise<any>;
    addToCart(userId: number, addToCartDto: AddToCartDto): Promise<any>;
    updateCartItem(userId: number, updateCartItemDto: UpdateCartItemDto): Promise<any>;
    removeCartItem(userId: number, cartItemId: number): Promise<any>;
    clearCart(userId: number): Promise<any>;
    getCartSummary(cart: any): Promise<{
        totalItems: number;
        subtotal: number;
        items: any;
    }>;
}
