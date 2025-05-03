import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationService } from 'src/utils/pagination.util';
import { CommonStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/services/file/file.service';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class CustomerService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pagination: PaginationService,
        private readonly filesService: FilesService,
    ) { }

    async findAll(page: number = 1, limit: number = 10, search?: string): Promise<any> {
        const where: any = { role: Role.USER, status: CommonStatus.ACTIVE };

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

        const paginate = await this.pagination.paginate(
            TableName.USER,
            { page, limit },
            where,
            select,
            orderBy
        );

        return paginate;
    }

    async findOne(id: number): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { id, status: CommonStatus.ACTIVE },
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
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async create(createCustomerDto: CreateCustomerDto, avatar?: Express.Multer.File): Promise<any> {
        const emailExists = await this.prismaService.user.findUnique({
            where: { email: createCustomerDto.email },
        });

        if (emailExists) {
            throw new ConflictException(`User with email "${createCustomerDto.email}" already exists`);
        }

        const hashedPassword = await bcrypt.hash(createCustomerDto.password, 10);

        let avatarData = null;
        if (avatar) {
            avatarData = await this.filesService.uploadFile(
                avatar.buffer,
                avatar.originalname,
                'avatars',
                'image'
            );
        }
        // Use avatar from DTO if provided and no file was uploaded
        else if (createCustomerDto.avatar) {
            avatarData = createCustomerDto.avatar;
        }

        const user = await this.prismaService.user.create({
            data: {
                ...createCustomerDto,
                password: hashedPassword,
                role: Role.USER,
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

    async update(id: number, updateCustomerDto: UpdateCustomerDto, avatar?: Express.Multer.File): Promise<any> {
        const userExists = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!userExists) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateCustomerDto.email && updateCustomerDto.email !== userExists.email) {
            const emailExists = await this.prismaService.user.findUnique({
                where: { email: updateCustomerDto.email },
            });

            if (emailExists) {
                throw new ConflictException(`User with email "${updateCustomerDto.email}" already exists`);
            }
        }

        const updateData: any = { ...updateCustomerDto };
        if (updateCustomerDto.password) {
            updateData.password = await bcrypt.hash(updateCustomerDto.password, 10);
        }

        // Handle avatar upload if provided
        let avatarData = undefined;
        if (avatar) {
            // Delete old avatar if exists
            if (userExists.avatar) {
                const oldAvatar = typeof userExists.avatar === 'string'
                    ? JSON.parse(userExists.avatar)
                    : userExists.avatar;

                if (oldAvatar && oldAvatar.fileName) {
                    await this.filesService.deletePublicFile(oldAvatar.fileName);
                }
            }

            avatarData = await this.filesService.uploadFile(
                avatar.buffer,
                avatar.originalname,
                'avatars',
                'image'
            );
        }
        // If avatar is explicitly set to null in DTO, delete old avatar
        else if (updateCustomerDto.avatar === "" && userExists.avatar) {
            const oldAvatar = typeof userExists.avatar === 'string'
                ? JSON.parse(userExists.avatar)
                : userExists.avatar;

            if (oldAvatar && oldAvatar.fileName) {
                await this.filesService.deletePublicFile(oldAvatar.fileName);
            }

            avatarData = null;
        }

        // Update the user
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

    async remove(id: number): Promise<void> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                orders: {
                    take: 1,
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (user.orders.length > 0) {
            throw new BadRequestException('Cannot delete a user who has orders');
        }

        if (user.avatar) {
            try {
                const avatar = typeof user.avatar === 'string'
                    ? JSON.parse(user.avatar)
                    : user.avatar;

                if (avatar && avatar.fileName) {
                    await this.filesService.deletePublicFile(avatar.fileName);
                }
            } catch (error) {
                console.error('Error deleting user avatar:', error);
            }
        }

        // Soft delete the user
        await this.prismaService.user.update({
            where: { id },
            data: {
                status: CommonStatus.INACTIVE
            }
        });
    }

    async getUserOrders(userId: number, page: number = 1, limit: number = 10): Promise<any> {
        const userExists = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            throw new NotFoundException(`User with ID ${userId} not found`);
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

        const paginate = await this.pagination.paginate(
            TableName.ORDER,
            { page, limit },
            where,
            select,
            orderBy
        );

        return paginate;
    }
}
