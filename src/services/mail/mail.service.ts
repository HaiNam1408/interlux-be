import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './mail.interface';
import { renderTemplate } from 'src/utils/template.util';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const options: MailOptions = {
      service: 'gmail',
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    this.transporter = nodemailer.createTransport(options);
  }

  async sendVerificationEmail(email: string, token: string, name: string) {
    const context = {
      name,
      link: `${process.env.API_URL}/api/v1/auth/verify-email?token=${token}&email=${email}`,
      button: 'Verify',
      title: 'We received your registration request, please confirm the information.',
      desc: 'The link is valid for 5 minutes. Please click confirm.',
      note: 'If you did not make this request, your account will not be activated.',
    };

    const html = await renderTemplate('email-template.ejs', context);

    const info = await this.transporter.sendMail({
      from: `"InterLux" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '[InterLux] Verify Your Email Now',
      html,
    });

    return info;
  }

  async sendForgotPasswordEmail(email: string, token: string, name: string) {
    const context = {
      name,
      link: `${process.env.API_URL}/api/v1/auth/change-password?token=${token}&email=${email}`,
      button: `Change your password`,
      title: 'You have requested to reset your password.',
      desc: 'Please click the link below to reset your password. This link is valid for only 10 minutes.',
      note: 'If you did not request a password reset, please ignore this email.',
    };

    const html = await renderTemplate('email-template.ejs', context);

    const info = await this.transporter.sendMail({
      from: `"InterLux" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '[InterLux] Reset Your Password',
      html,
    });

    return info;
  }

  async sendOrderSuccessEmail(email: string, name: string, order: any) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const orderViewUrl = `${clientUrl}/account/orders/${order.id}`;
    const orderDate = new Date(order.createdAt || new Date()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const items = [];
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const productData = item.metadata?.variation || item.metadata?.product;
        const productName = item.metadata?.product.title || 'Product';
        const productImage = productData.images[0].filePath || '';
        const productPrice = productData.price - (productData.price * productData.percentOff / 100);
        const productSku = productData.sku || `SKU-${item.productId}`;
        let variantDetails = '';
        if (item.metadata?.variation && item.metadata?.variation.attributeValues) {
            const attributes = [];
            for (const attrKey in item.metadata.variation.attributeValues) {
              if (item.metadata.variation.attributeValues[attrKey]) {
                attributes.push(item.metadata.variation.attributeValues[attrKey]);
              }
            }
            variantDetails = attributes.join(' - ');
        }

        items.push({
          sku: productSku,
          name: productName,
          image: productImage,
          variant: variantDetails,
          price: productPrice,
          quantity: item.quantity,
          total: formatCurrency(item.total)
        });
      }
    }

    // Process shipping address
    let shippingAddress = null;
    if (order.shippingAddress) {
        const address = typeof order.shippingAddress === 'string' ?
          JSON.parse(order.shippingAddress) : order.shippingAddress;

        shippingAddress = {
          fullName: address.fullName || name,
          phone: address.phone || '',
          address: address.address || '',
          ward: address.ward || '',
          district: address.district || '',
          province: address.province || ''
        };
    }

    const templateData = {
      name,
      orderNumber: order.orderNumber,
      orderDate,
      orderUrl: orderViewUrl,
      items,
      subtotal: formatCurrency(order.subtotal),
      shipping: formatCurrency(order.shippingFee),
      tax: order.tax ? formatCurrency(order.tax) : null,
      discount: order.discount > 0 ? formatCurrency(order.discount) : null,
      total: formatCurrency(order.total),
      shippingAddress,
      paymentMethod: order.payment?.method ? formatPaymentMethod(order.payment.method) : 'Online Payment'
    };

    function formatPaymentMethod(method: string): string {
      if (!method) return 'Online Payment';

      const methodMap = {
        'BANK_TRANSFER': 'Bank Transfer',
        'CREDIT_CARD': 'Credit Card',
        'MOMO': 'MoMo Wallet',
        'VNPAY': 'VNPay',
        'PAYPAL': 'PayPal',
        'COD': 'Cash On Delivery'
      };

      return methodMap[method] || method;
    }

    const html = await renderTemplate('order-success.ejs', templateData);

    const info = await this.transporter.sendMail({
      from: `"InterLux" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `[InterLux] Order Successfully #${order.orderNumber}`,
      html,
    });

    return info;
  }
}