import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './services/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from './api/admin/admin.module';
import { ClientModule } from './api/client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    CacheModule.register({ isGlobal: true }),
    AdminModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
