import { ProductStatus } from '@prisma/client';
export declare class UpdateProductDto {
    title?: string;
    description?: string;
    price?: number;
    percentOff?: number;
    attributes?: object;
    categoryId?: number;
    sort?: number;
    status?: ProductStatus;
    imagesToDelete?: object[];
    images?: any[];
}
