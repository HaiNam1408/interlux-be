"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                        productVariation: {
                            include: {
                                attributeValues: {
                                    include: {
                                        attributeValue: {
                                            include: {
                                                attribute: true,
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
            cart = await this.prisma.cart.findUnique({
                where: { id: newCart.id },
                include: {
                    items: {
                        include: {
                            product: true,
                            productVariation: {
                                include: {
                                    attributeValues: {
                                        include: {
                                            attributeValue: {
                                                include: {
                                                    attribute: true,
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
                cart = {
                    ...newCart,
                    items: []
                };
            }
        }
        return cart;
    }
    async addToCart(userId, addToCartDto) {
        const { productId, productVariationId, quantity } = addToCartDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        if (productVariationId) {
            const productVariation = await this.prisma.productVariation.findUnique({
                where: { id: productVariationId },
            });
            if (!productVariation) {
                throw new common_1.NotFoundException('Biến thể sản phẩm không tồn tại');
            }
            if (productVariation.inventory < quantity) {
                throw new common_1.BadRequestException('Số lượng sản phẩm trong kho không đủ');
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
        }
        else {
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
    async updateCartItem(userId, updateCartItemDto) {
        const { cartItemId, quantity } = updateCartItemDto;
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true, productVariation: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Mục trong giỏ hàng không tồn tại');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Bạn không có quyền sửa đổi giỏ hàng này');
        }
        if (cartItem.productVariationId) {
            if (cartItem.productVariation.inventory < quantity) {
                throw new common_1.BadRequestException('Số lượng sản phẩm trong kho không đủ');
            }
        }
        await this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
        return this.getOrCreateCart(userId);
    }
    async removeCartItem(userId, cartItemId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Mục trong giỏ hàng không tồn tại');
        }
        if (cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Bạn không có quyền sửa đổi giỏ hàng này');
        }
        await this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
        return this.getOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return this.getOrCreateCart(userId);
    }
    async getCartSummary(cart) {
        let totalItems = 0;
        let subtotal = 0;
        if (cart && cart.items) {
            for (const item of cart.items) {
                totalItems += item.quantity;
                let itemPrice = item.product.price;
                let itemDiscount = item.product.percentOff || 0;
                if (item.productVariation?.price) {
                    itemPrice = item.productVariation.price;
                    itemDiscount = item.productVariation.percentOff || 0;
                }
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map