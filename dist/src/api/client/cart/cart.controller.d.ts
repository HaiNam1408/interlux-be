import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<ApiResponse<{
        cart: any;
        summary: {
            totalItems: number;
            subtotal: number;
            items: any;
        };
    }>>;
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<ApiResponse<{
        cart: any;
        summary: {
            totalItems: number;
            subtotal: number;
            items: any;
        };
        message: string;
    }>>;
    updateCartItem(req: any, updateCartItemDto: UpdateCartItemDto): Promise<ApiResponse<{
        cart: any;
        summary: {
            totalItems: number;
            subtotal: number;
            items: any;
        };
        message: string;
    }>>;
    removeCartItem(req: any, cartItemId: string): Promise<ApiResponse<{
        cart: any;
        summary: {
            totalItems: number;
            subtotal: number;
            items: any;
        };
        message: string;
    }>>;
    clearCart(req: any): Promise<ApiResponse<{
        cart: any;
        summary: {
            totalItems: number;
            subtotal: number;
            items: any;
        };
        message: string;
    }>>;
}
