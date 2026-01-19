"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coupon_service_1 = require("./coupon.service");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const get_all_coupon_dto_1 = require("./dto/get-all-coupon.dto");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
    }
    async findAll({ page = 1, limit = 10, status }) {
        try {
            const result = await this.couponService.findAll(page, limit, status);
            return new api_response_1.default('Coupons retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const coupon = await this.couponService.findOne(id);
            return new api_response_1.default('Coupon retrieved successfully', common_1.HttpStatus.OK, coupon);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByCode(code) {
        try {
            const coupon = await this.couponService.findByCode(code);
            return new api_response_1.default('Coupon retrieved successfully', common_1.HttpStatus.OK, coupon);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(createCouponDto) {
        try {
            const coupon = await this.couponService.create(createCouponDto);
            return new api_response_1.default('Coupon created successfully', common_1.HttpStatus.CREATED, coupon);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateCouponDto) {
        try {
            const coupon = await this.couponService.update(id, updateCouponDto);
            return new api_response_1.default('Coupon updated successfully', common_1.HttpStatus.OK, coupon);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.couponService.remove(id);
            return new api_response_1.default('Coupon deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_coupon_dto_1.GetAllCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get coupon by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', type: String }),
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "findByCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new coupon' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update coupon' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete coupon' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Coupon deleted successfully' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "remove", null);
exports.CouponController = CouponController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Coupon'),
    (0, common_1.Controller)('coupon'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupon.controller.js.map