import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail/mail.service';
import { CacheService } from 'src/services/cache/cache.service';
import { CacheCustomModule } from 'src/services/cache/cache.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, MailService]
})
export class AuthModule {}
