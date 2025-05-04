import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { OrderStatus, PaymentStatus, Order } from '@prisma/client';
import { TableName } from 'src/common/enums/table.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { NotificationService } from 'src/services/notification/notification.service';

export interface OrderStatistics {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  returnedOrders: number;
  refundedOrders: number;
  completedOrders: number;
  recentOrders: any[];
}

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    search?: string,
    userId?: number,
  ) {
    const where: any = {};

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    // Filter by user ID if provided
    if (userId) {
      where.userId = userId;
    }

    // Search functionality
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ]
          }
        },
      ];
    }

    const select = {
      id: true,
      orderNumber: true,
      userId: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
        },
      },
      subtotal: true,
      shippingFee: true,
      tax: true,
      discount: true,
      total: true,
      status: true,
      shippingAddress: true,
      billingAddress: true,
      deliveryDate: true,
      createdAt: true,
      updatedAt: true,
      payment: {
        select: {
          id: true,
          method: true,
          status: true,
          transactionId: true,
        },
      },
      shipping: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      coupon: {
        select: {
          id: true,
          code: true,
          value: true,
          type: true,
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    };

    const orderBy = [{ createdAt: 'desc' }];

    const paginate = await this.pagination.paginate(
      TableName.ORDER,
      { page, limit },
      where,
      select,
      orderBy,
    );

    return paginate;
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: true,
              },
            },
            productVariation: {
              select: {
                id: true,
                sku: true,
                price: true,
                images: true,
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
        payment: true,
        shipping: true,
        coupon: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status, note } = updateOrderStatusDto;

    // Find the order
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true,
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check status transition logic
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled order');
    }

    if (order.status === OrderStatus.COMPLETED && status !== OrderStatus.REFUNDED) {
      throw new BadRequestException('Cannot change status of completed order');
    }

    // Update order status and note if provided
    const updateData: any = { status };
    if (note) {
      updateData.note = note;
    }

    // Update order status
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        payment: true,
        shipping: true,
        coupon: true,
        user: true,
      },
    });

    // Update corresponding payment status
    let paymentStatus: PaymentStatus;
    switch (status) {
      case OrderStatus.COMPLETED:
        paymentStatus = PaymentStatus.COMPLETED;
        break;
      case OrderStatus.CANCELLED:
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      case OrderStatus.RETURNED:
        paymentStatus = PaymentStatus.PROCESSING; // Order is returned but payment not yet refunded
        break;
      case OrderStatus.REFUNDED:
        paymentStatus = PaymentStatus.REFUNDED;
        break;
      default:
        paymentStatus = PaymentStatus.PROCESSING;
    }

    // Update payment status if payment exists
    if (order.paymentId) {
      await this.prisma.payment.update({
        where: { id: order.paymentId },
        data: { status: paymentStatus },
      });
    }

    // Send notification based on the new status
    if (updatedOrder.user) {
      const userId = updatedOrder.user.id;

      switch (status) {
        case OrderStatus.PROCESSING:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_CONFIRMED',
            { orderNumber: updatedOrder.orderNumber },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.SHIPPED:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_SHIPPED',
            { orderNumber: updatedOrder.orderNumber },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.DELIVERED:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_DELIVERED',
            { orderNumber: updatedOrder.orderNumber },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.COMPLETED:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_COMPLETED',
            { orderNumber: updatedOrder.orderNumber },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.CANCELLED:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_CANCELLED',
            {
              orderNumber: updatedOrder.orderNumber,
              reason: note || 'Order cancelled by admin'
            },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.RETURNED:
          await this.notificationService.createFromTemplate(
            userId,
            'ORDER_RETURNED',
            {
              orderNumber: updatedOrder.orderNumber,
              reason: note || 'Order returned'
            },
            updatedOrder.id,
            'Order'
          );
          break;
        case OrderStatus.REFUNDED:
          await this.notificationService.createFromTemplate(
            userId,
            'PAYMENT_REFUNDED',
            {
              orderNumber: updatedOrder.orderNumber,
              amount: updatedOrder.total,
              currency: 'VND'
            },
            updatedOrder.id,
            'Order'
          );
          break;
      }
    }

    // Process inventory return if order is cancelled, returned, or refunded
    if (status === OrderStatus.CANCELLED || status === OrderStatus.RETURNED || status === OrderStatus.REFUNDED) {
      // Return products to inventory
      for (const item of updatedOrder.items) {
        if (item.productVariationId) {
          await this.prisma.productVariation.update({
            where: { id: item.productVariationId },
            data: { inventory: { increment: item.quantity } },
          });
        }

        // Decrease product sold count
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { sold: { decrement: item.quantity } },
        });
      }

      // Decrease coupon usage count if applicable
      if (order.couponId) {
        await this.prisma.coupon.update({
          where: { id: order.couponId },
          data: { usageCount: { decrement: 1 } },
        });
      }
    }

    return updatedOrder;
  }

  async getOrderStatistics(): Promise<OrderStatistics> {
    // Get total orders count
    const totalOrders = await this.prisma.order.count();

    // Get orders count by status
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // Create a map to easily access counts by status
    const statusCountMap = {};
    ordersByStatus.forEach(item => {
      statusCountMap[item.status] = item._count.id;
    });

    // Get total sales (revenue) from completed and delivered orders
    const revenue = await this.prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
        },
      },
      _sum: {
        total: true,
      },
    });

    // Get recent orders (last 5)
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
          },
        },
        items: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // Return data in the requested format
    return {
      totalOrders,
      totalSales: revenue._sum.total || 0,
      pendingOrders: statusCountMap[OrderStatus.PENDING] || 0,
      processingOrders: statusCountMap[OrderStatus.PROCESSING] || 0,
      shippedOrders: statusCountMap[OrderStatus.SHIPPED] || 0,
      deliveredOrders: statusCountMap[OrderStatus.DELIVERED] || 0,
      cancelledOrders: statusCountMap[OrderStatus.CANCELLED] || 0,
      completedOrders: statusCountMap[OrderStatus.COMPLETED] || 0,
      returnedOrders: statusCountMap[OrderStatus.RETURNED] || 0,
      refundedOrders: statusCountMap[OrderStatus.REFUNDED] || 0,
      recentOrders,
    };
  }
}
