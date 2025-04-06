import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AuthController } from './auth/auth.controller';
import { CategoryController } from './category/category.controller';

@Module({
    imports: [
        AuthModule,
        CategoryModule,
    ],
    controllers: [
        AuthController, 
        CategoryController
    ],
})
export class ClientModule { }
 