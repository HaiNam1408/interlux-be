import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    title: string;
    description?: string;
    price: number;
    percentOff?: number;
    attributes?: object;
    categoryId: number;
    sort?: number;
    status?: ProductStatus;
    images: string[];
}
