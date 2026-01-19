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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma.service");
const pagination_util_1 = require("../../../utils/pagination.util");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const file_service_1 = require("../../../services/file/file.service");
const table_enum_1 = require("../../../common/enums/table.enum");
let CustomerService = class CustomerService {
    constructor(prismaService, pagination, filesService) {
        this.prismaService = prismaService;
        this.pagination = pagination;
        this.filesService = filesService;
    }
    async findAll(page = 1, limit = 10, search) {
        const where = { role: client_1.Role.USER, status: client_1.CommonStatus.ACTIVE };
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const select = {
            id: true,
            username: true,
            email: true,
            phone: true,
            role: true,
            address: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
        };
        const orderBy = [{ createdAt: 'desc' }];
        const paginate = await this.pagination.paginate(table_enum_1.TableName.USER, { page, limit }, where, select, orderBy);
        return paginate;
    }
    async findOne(id) {
        const user = await this.prismaService.user.findUnique({
            where: { id, status: client_1.CommonStatus.ACTIVE },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                role: true,
                address: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        orders: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async create(createCustomerDto, avatar) {
        const emailExists = await this.prismaService.user.findUnique({
            where: { email: createCustomerDto.email },
        });
        if (emailExists) {
            throw new common_1.ConflictException(`User with email "${createCustomerDto.email}" already exists`);
        }
        const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);
        let avatarData = null;
        if (avatar) {
            avatarData = await this.filesService.uploadFile(avatar.buffer, avatar.originalname, 'avatars', 'image');
        }
        else if (createCustomerDto.avatar) {
            avatarData = createCustomerDto.avatar;
        }
        const user = await this.prismaService.user.create({
            data: {
                ...createCustomerDto,
                password: hashedPassword,
                role: client_1.Role.USER,
                avatar: avatarData,
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                role: true,
                address: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    async update(id, updateCustomerDto, avatar) {
        const userExists = await this.prismaService.user.findUnique({
            where: { id },
        });
        if (!userExists) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateCustomerDto.email && updateCustomerDto.email !== userExists.email) {
            const emailExists = await this.prismaService.user.findUnique({
                where: { email: updateCustomerDto.email },
            });
            if (emailExists) {
                throw new common_1.ConflictException(`User with email "${updateCustomerDto.email}" already exists`);
            }
        }
        const updateData = { ...updateCustomerDto };
        if (updateCustomerDto.password) {
            updateData.password = await bcrypt.hash(updateCustomerDto.password, 10);
        }
        let avatarData = undefined;
        if (avatar) {
            if (userExists.avatar) {
                const oldAvatar = typeof userExists.avatar === 'string'
                    ? JSON.parse(userExists.avatar)
                    : userExists.avatar;
                if (oldAvatar && oldAvatar.fileName) {
                    await this.filesService.deletePublicFile(oldAvatar.fileName);
                }
            }
            avatarData = await this.filesService.uploadFile(avatar.buffer, avatar.originalname, 'avatars', 'image');
        }
        else if (updateCustomerDto.avatar === "" && userExists.avatar) {
            const oldAvatar = typeof userExists.avatar === 'string'
                ? JSON.parse(userExists.avatar)
                : userExists.avatar;
            if (oldAvatar && oldAvatar.fileName) {
                await this.filesService.deletePublicFile(oldAvatar.fileName);
            }
            avatarData = null;
        }
        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: {
                ...updateData,
                avatar: avatarData
            },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                role: true,
                address: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async remove(id) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                orders: {
                    take: 1,
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (user.orders.length > 0) {
            throw new common_1.BadRequestException('Cannot delete a user who has orders');
        }
        if (user.avatar) {
            try {
                const avatar = typeof user.avatar === 'string'
                    ? JSON.parse(user.avatar)
                    : user.avatar;
                if (avatar && avatar.fileName) {
                    await this.filesService.deletePublicFile(avatar.fileName);
                }
            }
            catch (error) {
                console.error('Error deleting user avatar:', error);
            }
        }
        await this.prismaService.user.update({
            where: { id },
            data: {
                status: client_1.CommonStatus.INACTIVE
            }
        });
    }
    async getUserOrders(userId, page = 1, limit = 10) {
        const userExists = await this.prismaService.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const where = { userId };
        const select = {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
            updatedAt: true,
            shippingAddress: true,
            items: {
                select: {
                    id: true,
                    quantity: true,
                    price: true,
                    total: true,
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            images: true,
                        },
                    },
                    productVariation: {
                        select: {
                            id: true,
                            sku: true,
                            price: true,
                            images: true,
                            attributeValues: {
                                select: {
                                    attributeValue: {
                                        select: {
                                            id: true,
                                            value: true,
                                            attribute: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            payment: {
                select: {
                    id: true,
                    method: true,
                    status: true,
                    amount: true,
                },
            },
        };
        const orderBy = [{ createdAt: 'desc' }];
        const paginate = await this.pagination.paginate(table_enum_1.TableName.ORDER, { page, limit }, where, select, orderBy);
        return paginate;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pagination_util_1.PaginationService,
        file_service_1.FilesService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map