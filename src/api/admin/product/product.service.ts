import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesService } from 'src/services/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { Product, ProductStatus } from '@prisma/client';
import { SlugUtil } from 'src/utils/createSlug.util';
import { PaginationService } from 'src/utils/pagination.util';
import { TableName } from 'src/common/enums/table.enum';

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly filesService: FilesService,
        private readonly pagination: PaginationService
    ) { }

    async create(
        createProductDto: CreateProductDto,
        images: Express.Multer.File[],
    ): Promise<any> {
        const category = await this.prisma.category.findFirst({
            where: { id: createProductDto.categoryId },
        });

        if (!category) {
            throw new Error('Category not found');
        }

        const slug = SlugUtil.createSlug(createProductDto.title);
        const existingProductWithSlug = await this.prisma.product.findFirst({
            where: { slug },
        });

        if (existingProductWithSlug) {
            throw new Error('Slug already exists');
        }

        let uploadedImages;
        if (images || images.length === 0) {
            uploadedImages = await Promise.all(
                images.map((image) =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product',
                        'image',
                    ),
                ),
            );
        }


        const newProduct = await this.prisma.product.create({
            data: {
                title: createProductDto.title,
                slug,
                description: createProductDto.description,
                price: createProductDto.price,
                percentOff: createProductDto.percentOff,
                attributes: createProductDto.attributes,
                categoryId: createProductDto.categoryId,
                images: JSON.stringify(uploadedImages),
                sort: createProductDto.sort,
                status: createProductDto.status || ProductStatus.DRAFT,
            }
        });

        return newProduct;
    }

    async findAll(
        page: number = 1, 
        limit: number = 10, 
        status?: ProductStatus, 
        categoryId?: number, 
        search?: string
    ): Promise<any> {
        const where = {};
        
        if (status) {
            where['status'] = status;
        }
        
        if (categoryId) {
            where['categoryId'] = categoryId;
        }
        
        if (search) {
            where['OR'] = [
                { title: { contains: search } },
                { description: { contains: search } }
            ];
        }
        
        const select = {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            percentOff: true,
            attributes: true,
            images: true,
            sort: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            categoryId: true,
            category: true
        };
        
        const orderBy = [{ sort: 'asc' } ,{ createdAt: 'desc' }];
        
        const paginate = await this.pagination.paginate(
            TableName.PRODUCT,
            { page, limit },
            where,
            select,
            orderBy
        );
        
        if (paginate.data && paginate.data.length > 0) {
            paginate.data.forEach((item: Product) => {
                if (item.images) {
                    item.attributes = JSON.parse(item.attributes as string);
                    item.images = JSON.parse(item.images as string);
                }
            });
        }
        
        return paginate;
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!product) {
            throw new HttpException('Product not found', 404);
        }

        if (product.images) {
            product.images = JSON.parse(product.images as string);
        }

        if (product.attributes) {
            product.attributes = JSON.parse(product.attributes as string);
        }

        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        newImages?: Express.Multer.File[],
    ) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Check if category exists when updating
        if (updateProductDto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: updateProductDto.categoryId },
            });

            if (!category) {
                throw new Error('Category not found');
            }
        }

        // Check slug uniqueness if updating title
        const newSlug = updateProductDto.title
            ? SlugUtil.createSlug(updateProductDto.title)
            : product.slug;

        if (updateProductDto.title && newSlug !== product.slug) {
            const existingProductWithSlug = await this.prisma.product.findFirst({
                where: {
                    slug: newSlug,
                    NOT: { id }
                },
            });

            if (existingProductWithSlug) {
                throw new Error('Slug already exists');
            }
        }

        // Handle image updates
        const imagesToDelete = updateProductDto.imagesToDelete ?? [];
        let currentImages = product.images ? JSON.parse(product.images as string) : [];

        // Handle deleting specific images if requested
        if (imagesToDelete && imagesToDelete.length > 0) {
            const imagesToRemove = currentImages.filter(img =>
                imagesToDelete.includes(img.fileName) || imagesToDelete.includes(img.url)
            );

            await Promise.all(
                imagesToRemove.map(image => this.filesService.deletePublicFile(image.fileName))
            );

            currentImages = currentImages.filter(img =>
                !imagesToDelete.includes(img.fileName) && !imagesToDelete.includes(img.url)
            );
        }

        // Handle uploading new images if provided
        if (newImages && newImages.length > 0) {
            const uploadedImages = await Promise.all(
                newImages.map(image =>
                    this.filesService.uploadFile(
                        image.buffer,
                        image.originalname,
                        'product',
                        'image',
                    )
                )
            );

            currentImages = [...currentImages, ...uploadedImages];
        }

        const imageData = JSON.stringify(currentImages);
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                title: updateProductDto.title !== undefined ? updateProductDto.title : undefined,
                slug: newSlug !== product.slug ? newSlug : undefined,
                description: updateProductDto.description !== undefined ? updateProductDto.description : undefined,
                price: updateProductDto.price !== undefined ? updateProductDto.price : undefined,
                percentOff: updateProductDto.percentOff !== undefined ? updateProductDto.percentOff : undefined,
                attributes: updateProductDto.attributes !== undefined ? updateProductDto.attributes : undefined,
                categoryId: updateProductDto.categoryId !== undefined ? updateProductDto.categoryId : undefined,
                sort: updateProductDto.sort !== undefined ? updateProductDto.sort : undefined,
                status: updateProductDto.status !== undefined ? updateProductDto.status : undefined,
                images: imageData,
            },
        });

        return updatedProduct;
    }

    async updateStatus(id: number, status: ProductStatus) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return await this.prisma.product.update({
            where: { id },
            data: { status },
        });
    }

    async remove(id: number): Promise<void> {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.images) {
            const images = JSON.parse(product.images as string);
            await Promise.all(
                images.map((image) => this.filesService.deletePublicFile(image.fileName)),
            );
        }

        await this.prisma.product.delete({
            where: { id },
        });
    }
}