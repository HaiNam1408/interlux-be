# Notification Service

This service provides a centralized way to manage and send notifications to users in the application.

## Features

- Create notifications for users
- Create notifications for multiple users at once
- Mark notifications as read
- Get unread notification count
- Delete notifications
- Template-based notifications
- Support for different notification types (Order, Payment, Shipping, etc.)

## Usage

### Import the Module

First, import the `NotificationModule` in your module:

```typescript
import { Module } from '@nestjs/common';
import { NotificationModule } from 'src/services/notification/notification.module';

@Module({
  imports: [NotificationModule],
  // ...
})
export class YourModule {}
```

### Inject the Service

Then, inject the `NotificationService` in your service:

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services/notification/notification.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class YourService {
  constructor(private readonly notificationService: NotificationService) {}

  // Your methods...
}
```

### Create a Notification

```typescript
// Create a simple notification
async createNotification(userId: number) {
  await this.notificationService.create({
    userId,
    title: 'Welcome to InterLux',
    content: 'Thank you for joining our platform!',
    type: NotificationType.SYSTEM,
  });
}

// Create an order notification
async createOrderNotification(userId: number, orderId: number) {
  await this.notificationService.createOrderNotification(
    userId,
    'Order Confirmed',
    'Your order has been confirmed and is being processed.',
    orderId
  );
}
```

### Using Templates

```typescript
// Create a notification using a template
async sendOrderConfirmation(userId: number, orderId: number, orderNumber: string) {
  await this.notificationService.createFromTemplate(
    userId,
    'ORDER_CONFIRMED',
    { orderNumber },
    orderId,
    'Order'
  );
}

// Send a notification to multiple users
async sendPromotionToUsers(userIds: number[], couponCode: string, discount: string) {
  await this.notificationService.createFromTemplateForMultipleUsers(
    userIds,
    'NEW_COUPON',
    { couponCode, discount, expiryDate: '2023-12-31' }
  );
}
```

### Get User Notifications

```typescript
// Get all notifications for a user
async getUserNotifications(userId: number, page = 1, limit = 10) {
  return this.notificationService.getNotificationsForUser(userId, page, limit);
}

// Get unread notification count
async getUnreadCount(userId: number) {
  return this.notificationService.getUnreadCount(userId);
}
```

### Mark Notifications as Read

```typescript
// Mark a notification as read
async markAsRead(notificationId: number, userId: number) {
  return this.notificationService.markAsRead(notificationId, userId);
}

// Mark all notifications as read
async markAllAsRead(userId: number) {
  return this.notificationService.markAllAsRead(userId);
}
```

## Adding Custom Templates

You can add custom notification templates by using the `NotificationTemplateService`:

```typescript
import { Injectable } from '@nestjs/common';
import { NotificationTemplateService } from 'src/services/notification/notification-template.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class YourService {
  constructor(private readonly templateService: NotificationTemplateService) {
    // Add a custom template
    this.templateService.addTemplate('CUSTOM_NOTIFICATION', {
      type: NotificationType.SYSTEM,
      title: 'Custom Notification',
      content: 'This is a custom notification.',
      getTitle: (params) => `Custom: ${params.title || 'Notification'}`,
      getContent: (params) => params.content || 'This is a custom notification.',
    });
  }
}
```

## Available Templates

The notification service comes with several pre-defined templates:

### Order Templates
- `ORDER_CREATED`: When a new order is created
- `ORDER_CONFIRMED`: When an order is confirmed
- `ORDER_SHIPPED`: When an order is shipped
- `ORDER_DELIVERED`: When an order is delivered
- `ORDER_CANCELLED`: When an order is cancelled

### Payment Templates
- `PAYMENT_RECEIVED`: When a payment is received
- `PAYMENT_FAILED`: When a payment fails
- `PAYMENT_REFUNDED`: When a payment is refunded

### Promotion Templates
- `NEW_COUPON`: When a new coupon is available
- `COUPON_EXPIRING`: When a coupon is about to expire
- `SPECIAL_OFFER`: For special promotions

### Product Templates
- `PRODUCT_BACK_IN_STOCK`: When a product is back in stock
- `PRODUCT_PRICE_DROP`: When a product's price drops
- `NEW_PRODUCT`: When a new product is available

### System Templates
- `ACCOUNT_CREATED`: When a user account is created
- `PASSWORD_CHANGED`: When a user's password is changed
- `PROFILE_UPDATED`: When a user's profile is updated
