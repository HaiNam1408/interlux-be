import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AuthController } from './auth/auth.controller';
import { CategoryController } from './category/category.controller';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [
        AuthModule,
        CategoryModule,
        CartModule,
    ],
    providers: [
        JwtService,
        PrismaService
    ],
    controllers: [
        AuthController, 
        CategoryController,
        CartController
    ],
})
export class ClientModule { }
 