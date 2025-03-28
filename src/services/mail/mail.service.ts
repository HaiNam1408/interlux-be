import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer";
import { MailOptions } from './mail.interface';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const options: MailOptions = {
            service: "gmail",
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
      const url = `${process.env.API_URL}/v1/auth/verify-email?token=${token}&email=${email}`;
        const info = await this.transporter.sendMail({
            from: `"InterLux" <${process.env.EMAIL_USER}>`,
            to: email,
          subject: '[InterLux] Verify Your Email Now',
            html: this.renderHtml(name, url),
        });

        return info;
    }

    renderHtml(name: string, link: string): string {
        let context = {
            name,
            link,
            button: "Verify",
            title: "We receive your registration request, please confirm the information.",
            desc: "The link is valid for 5 minutes. Please click confirm",
            note: "If you do not make this request, your account will not be activated.",
        };

        return `
     <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LUMA - Password Reset</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f2f5;
          color: #333;
          line-height: 1.6;
          text-align: center;
        }

        header {
          background-color: #fff;
          padding: 15px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .logo {
          width: 120px;
          height: auto;
        }

        .my-account {
          text-decoration: none;
          color: #4a4a4a;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .my-account:hover {
          color: #ff6b6b;
        }

        .main {
          max-width: 600px;
          margin:0 auto;
          text-align:center;
          background-color: #f0f2f5;
          padding: 40px;
          border-radius: 8px;
          margin-bottom:20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .main-logo {
          width: 150px;
          height: auto;
          margin: 0 auto;
          
        }

        h1 {
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 28px;
        }

        p {
          margin-bottom: 15px;
          color: #34495e;
        }

        button {
          display: inline-block;
          background-color: #2DAE89;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration:none;
          font-size: 16px;
          margin-top: 10px;
        }
        button a {
          color:white !important;
        }
        a {
          text-decoration:none;
          color:white
        }
        a:link {
        color: white;
        }

        a:visited {
        color: white;
        }
        button:hover {
          background-color: #2DAE89;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
        }

        .action-button.disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        .countdown {
          font-size: 28px;
          font-weight: bold;
          margin-top: 25px;
          text-align: center;
          color: #e74c3c;
        }

        footer {
          background-color: #2c3e50;
          color: #ecf0f1;
          padding: 25px 5%;
          text-align: center;
          font-size: 14px;
        }

        footer p {
          margin-bottom: 10px;
          color: #bdc3c7;
        }

        footer a {
          color: #3498db;
          text-decoration: none;
          margin: 0 10px;
          transition: color 0.3s ease;
        }

        footer a:hover {
          color: #2980b9;
          text-decoration: underline;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          main {
            margin: 20px 15px;
            padding: 30px;
          }

          h1 {
            font-size: 24px;
          }

          .countdown {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="main">
        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0d41d240723243.578a950f65386.png" alt="Logo" class="main-logo">
        <h1>Xin chào, ${context.name}!</h1>
        <p>${context?.title}</p>
        <p>${context?.desc}</p>
        <button><a href="${context.link}" class="action-button" id="setPasswordButton">${context.button}</a></button>
        <p>${context?.note}.</p>
      </div>

      <footer>
        <p>43 Xô Viết Nghệ Tĩnh, Hải Châu, Đà Nẵng, Việt Nam</p>
        <div>
          <a href="#">Điều khoản dịch vụ</a> | <a href="#">Chính sách</a> | <a href="#">Liên hệ chúng tôi</a>
        </div>
      </footer>
    </body>
    </html>
    `;
    }
}
