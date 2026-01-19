import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from 'src/services/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { ProductStatus } from '@prisma/client';
import { PaginationService } from 'src/utils/pagination.util';
export declare class ProductService {
    private readonly prisma;
    private readonly filesService;
    private readonly pagination;
    constructor(prisma: PrismaService, filesService: FilesService, pagination: PaginationService);
    create(createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<any>;
    findAll(page?: number, limit?: number, status?: ProductStatus, categoryId?: number, search?: string, includeInactive?: boolean): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateProductDto: UpdateProductDto, newImages?: Express.Multer.File[]): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        sort: number | null;
        slug: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        price: number;
        percentOff: number | null;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        categoryId: number;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        sold: number;
    }>;
    updateStatus(id: number, status: ProductStatus): Promise<{
        description: string | null;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        sort: number | null;
        slug: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        price: number;
        percentOff: number | null;
        attributes: import("@prisma/client/runtime/library").JsonValue | null;
        categoryId: number;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        sold: number;
    }>;
    remove(id: number): Promise<void>;
    private transformProductDetail;
}
