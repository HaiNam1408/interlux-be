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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customer_service_1 = require("./customer.service");
const dto_1 = require("./dto");
const api_response_1 = require("../../../global/api.response");
const auth_guard_1 = require("../../../common/guards/auth.guard");
const role_guard_1 = require("../../../common/guards/role.guard");
const roles_decorators_1 = require("../../../common/decorators/roles.decorators");
const role_enum_1 = require("../../../common/enums/role.enum");
const handleError_global_1 = require("../../../global/handleError.global");
const platform_express_1 = require("@nestjs/platform-express");
let CustomerController = class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }
    async findAll({ page = 1, limit = 10, search }) {
        try {
            const result = await this.customerService.findAll(page, limit, search);
            return new api_response_1.default('Customers retrieved successfully', common_1.HttpStatus.OK, result);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async findOne(id) {
        try {
            const customer = await this.customerService.findOne(id);
            return new api_response_1.default('Customer retrieved successfully', common_1.HttpStatus.OK, customer);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async getUserOrders(id, page = 1, limit = 10) {
        try {
            const orders = await this.customerService.getUserOrders(id, page, limit);
            return new api_response_1.default('Customer orders retrieved successfully', common_1.HttpStatus.OK, orders);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async create(createCustomerDto, avatar) {
        try {
            const customer = await this.customerService.create(createCustomerDto, avatar);
            return new api_response_1.default('Customer created successfully', common_1.HttpStatus.CREATED, customer);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async update(id, updateCustomerDto, avatar) {
        try {
            const customer = await this.customerService.update(id, updateCustomerDto, avatar);
            return new api_response_1.default('Customer updated successfully', common_1.HttpStatus.OK, customer);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
    async remove(id) {
        try {
            await this.customerService.remove(id);
            return new api_response_1.default('Customer deleted successfully', common_1.HttpStatus.OK);
        }
        catch (error) {
            return (0, handleError_global_1.resError)(error);
        }
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GetAllCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get customer orders' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Get)(':id/orders'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getUserOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new customer' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Create Customer",
        type: dto_1.CreateCustomerDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: "Update Customer",
        type: dto_1.UpdateCustomerDto,
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "remove", null);
exports.CustomerController = CustomerController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Customer'),
    (0, common_1.Controller)('customer'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map