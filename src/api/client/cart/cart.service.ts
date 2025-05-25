import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getOrCreateCart(userId: number): Promise<any> {
        let cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                                percentOff: true,
                                images: true,
                            },
                        },
                        productVariation: {
                            select: {
                                id: true,
                                productId: true,
                                sku: true,
                                price: true,
                                percentOff: true,
                                images: true,
                                attributeValues: {
                                    select: {
                                        attributeValue: {
                                            select: {
                                                name: true,
                                                value: true
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            const newCart = await this.prisma.cart.create({
                data: { userId },
            });

            cart = {
                ...newCart,
                items: [],
            };
        }

        const updatedItems = cart.items.map((item) => {
            if (item.productVariation) {
                return {
                    ...item,
                    product: {
                        id: item.productVariation.id,
                        title: item.product?.title,
                        price: item.productVariation.price,
                        percentOff: item.productVariation.percentOff,
                        images: item.productVariation.images,
                        attributeValues: item.productVariation.attributeValues,
                    },
                    productVariation: undefined,
                };
            }
            
            return {
                ...item,
                productVariation: undefined,
            };
        });

        return {
            ...cart,
            items: updatedItems,
        };
    }
    

    async addToCart(userId: number, addToCartDto: AddToCartDto) {
        const { productId, productVariationId, quantity } = addToCartDto;

        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Sản phẩm không tồn tại');
        }

        if (productVariationId) {
            const productVariation = await this.prisma.productVariation.findUnique({
                where: { id: productVariationId, productId },
            });

            if (!productVariation) {
                throw new NotFoundException('Biến thể sản phẩm không tồn tại');
            }

            if (productVariation.inventory < quantity) {
                throw new BadRequestException('Số lượng sản phẩm trong kho không đủ');
            }
        }

        const cart = await this.getOrCreateCart(userId);

        const existingCartItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
                productVariationId: productVariationId || null,
            },
        });

        if (existingCartItem) {
            await this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            });
        } else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    productVariationId: productVariationId || null,
                    quantity,
                },
            });
        }

        return this.getOrCreateCart(userId);
    }

    async updateCartItem(userId: number, updateCartItemDto: UpdateCartItemDto) {
        const { cartItemId, quantity } = updateCartItemDto;

        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true, productVariation: true },
        });

        if (!cartItem) {
            throw new NotFoundException('Mục trong giỏ hàng không tồn tại');
        }

        if (cartItem.cart.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền sửa đổi giỏ hàng này');
        }

        if (cartItem.productVariationId) {
            if (cartItem.productVariation.inventory < quantity) {
                throw new BadRequestException('Số lượng sản phẩm trong kho không đủ');
            }
        }

        await this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });

        return this.getOrCreateCart(userId);
    }

    async removeCartItem(userId: number, cartItemId: number) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });

        if (!cartItem) {
            throw new NotFoundException('Mục trong giỏ hàng không tồn tại');
        }

        if (cartItem.cart.userId !== userId) {
            throw new BadRequestException('Bạn không có quyền sửa đổi giỏ hàng này');
        }

        await this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });

        return this.getOrCreateCart(userId);
    }

    async clearCart(userId: number) {
        const cart = await this.getOrCreateCart(userId);

        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return this.getOrCreateCart(userId);
    }

    async getCartSummary(cart: any) {
        let totalItems = 0;
        let subtotal = 0;

        if (cart && cart.items) {
            for (const item of cart.items) {
                totalItems += item.quantity;
                let itemPrice = item.product.price;
                let itemDiscount = item.product.percentOff || 0;

                const discountedPrice = itemPrice * (1 - itemDiscount / 100);
                subtotal += discountedPrice * item.quantity;
            }
        }

        return {
            totalItems,
            subtotal,
            items: cart.items ? cart.items.length : 0,
        };
    }
}