import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
import { JwtService } from '@nestjs/jwt';
import { FilesModule } from 'src/services/file/file.module';
import { FilesService } from 'src/services/file/file.service';

@Module({
  imports: [FilesModule],
  controllers: [CustomerController],
  providers: [CustomerService, PrismaService, PaginationService, JwtService, FilesService],
  exports: [CustomerService],
})
export class CustomerModule {}
