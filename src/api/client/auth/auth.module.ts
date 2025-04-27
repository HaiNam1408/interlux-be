import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail/mail.service';
import { NotificationModule } from 'src/services/notification/notification.module';
import { NotificationService } from 'src/services/notification';

@Module({
  imports: [NotificationModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, MailService, NotificationService],
  exports: [AuthService],
})
export class AuthModule {}
