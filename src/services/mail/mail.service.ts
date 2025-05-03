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
}