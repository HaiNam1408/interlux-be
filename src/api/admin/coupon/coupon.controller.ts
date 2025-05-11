import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse as SwaggerResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { GetAllCouponDto } from './dto/get-all-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Admin - Coupon')
@Controller('coupon')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @ApiOperation({ summary: 'Get all coupons' })
    @Get()
    async findAll(
        @Query() { page = 1, limit = 10, status }: GetAllCouponDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.couponService.findAll(page, limit, status);
            return new ApiResponse(
                'Coupons retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get coupon by ID' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            const coupon = await this.couponService.findOne(id);
            return new ApiResponse(
                'Coupon retrieved successfully',
                HttpStatus.OK,
                coupon
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get coupon by code' })
    @ApiParam({ name: 'code', type: String })
    @Get('code/:code')
    async findByCode(@Param('code') code: string): Promise<ApiResponse<any>> {
        try {
            const coupon = await this.couponService.findByCode(code);
            return new ApiResponse(
                'Coupon retrieved successfully',
                HttpStatus.OK,
                coupon
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Create new coupon' })
    @Post()
    async create(@Body() createCouponDto: CreateCouponDto): Promise<ApiResponse<any>> {
        try {
            const coupon = await this.couponService.create(createCouponDto);
            return new ApiResponse(
                'Coupon created successfully',
                HttpStatus.CREATED,
                coupon
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Update coupon' })
    @ApiParam({ name: 'id', type: Number })
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCouponDto: UpdateCouponDto
    ): Promise<ApiResponse<any>> {
        try {
            const coupon = await this.couponService.update(id, updateCouponDto);
            return new ApiResponse(
                'Coupon updated successfully',
                HttpStatus.OK,
                coupon
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Delete coupon' })
    @ApiParam({ name: 'id', type: Number })
    @SwaggerResponse({ status: 200, description: 'Coupon deleted successfully' })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        try {
            await this.couponService.remove(id);
            return new ApiResponse(
                'Coupon deleted successfully',
                HttpStatus.OK
            );
        } catch (error) {
            throw error instanceof HttpException
                ? error
                : new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}