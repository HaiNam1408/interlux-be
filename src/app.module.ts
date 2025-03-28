import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/client/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './services/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MailModule,
    // CacheModule.registerAsync(RedisOptions),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
