import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse as SwaggerResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto, GetAllCustomersDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from '@prisma/client';
import { resError } from 'src/global/handleError.global';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Admin - Customer')
@Controller('customer')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @ApiOperation({ summary: 'Get all customers' })
    @Get()
    async findAll(
        @Query() { page = 1, limit = 10, search }: GetAllCustomersDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.customerService.findAll(page, limit, search);
            return new ApiResponse(
                'Customers retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get customer by ID' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            const customer = await this.customerService.findOne(id);
            return new ApiResponse(
                'Customer retrieved successfully',
                HttpStatus.OK,
                customer
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get customer orders' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id/orders')
    async getUserOrders(
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<ApiResponse<any>> {
        try {
            const orders = await this.customerService.getUserOrders(id, page, limit);
            return new ApiResponse(
                'Customer orders retrieved successfully',
                HttpStatus.OK,
                orders
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Create new customer' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Create Customer",
        type: CreateCustomerDto,
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @Post()
    async create(
        @Body() createCustomerDto: CreateCustomerDto,
        @UploadedFile() avatar?: Express.Multer.File
    ): Promise<ApiResponse<any>> {
        try {
            const customer = await this.customerService.create(createCustomerDto, avatar);
            return new ApiResponse(
                'Customer created successfully',
                HttpStatus.CREATED,
                customer
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Update customer' })
    @ApiParam({ name: 'id', type: Number })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Update Customer",
        type: UpdateCustomerDto,
    })
    @UseInterceptors(FileInterceptor('avatar'))
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCustomerDto: UpdateCustomerDto,
        @UploadedFile() avatar?: Express.Multer.File
    ): Promise<ApiResponse<any>> {
        try {
            const customer = await this.customerService.update(id, updateCustomerDto, avatar);
            return new ApiResponse(
                'Customer updated successfully',
                HttpStatus.OK,
                customer
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete customer' })
    @ApiParam({ name: 'id', type: Number })
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            await this.customerService.remove(id);
            return new ApiResponse(
                'Customer deleted successfully',
                HttpStatus.OK
            );
        } catch (error) {
            return resError(error);
        }
    }
}
