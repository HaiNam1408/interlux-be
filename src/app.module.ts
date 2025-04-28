import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './services/mail/mail.module';
import { NotificationModule } from './services/notification/notification.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from './api/admin/admin.module';
import { ClientModule } from './api/client/client.module';
import { RouterModule } from '@nestjs/core';
import { RedisOptions } from './common/configs/redis.config';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    NotificationModule,
    CacheModule.registerAsync(RedisOptions),
    ClientModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
