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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const template_util_1 = require("../../utils/template.util");
let MailService = class MailService {
    constructor() {
        const options = {
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
    async sendVerificationEmail(email, token, name) {
        const context = {
            name,
            link: `${process.env.API_URL}/api/v1/auth/verify-email?token=${token}&email=${email}`,
            button: 'Verify',
            title: 'We received your registration request, please confirm the information.',
            desc: 'The link is valid for 5 minutes. Please click confirm.',
            note: 'If you did not make this request, your account will not be activated.',
        };
        const html = await (0, template_util_1.renderTemplate)('email-template.ejs', context);
        const info = await this.transporter.sendMail({
            from: `"InterLux" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '[InterLux] Verify Your Email Now',
            html,
        });
        return info;
    }
    async sendForgotPasswordEmail(email, token, name) {
        const context = {
            name,
            link: `${process.env.API_URL}/api/v1/auth/change-password?token=${token}&email=${email}`,
            button: `Change your password`,
            title: 'You have requested to reset your password.',
            desc: 'Please click the link below to reset your password. This link is valid for only 10 minutes.',
            note: 'If you did not request a password reset, please ignore this email.',
        };
        const html = await (0, template_util_1.renderTemplate)('email-template.ejs', context);
        const info = await this.transporter.sendMail({
            from: `"InterLux" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '[InterLux] Reset Your Password',
            html,
        });
        return info;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map