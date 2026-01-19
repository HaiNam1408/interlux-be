import { ProductStatus } from '@prisma/client';
export declare class FindAllProductsDto {
    page?: number;
    limit?: number;
    status?: ProductStatus;
    categoryId?: number;
    search?: string;
    includeInactive?: boolean;
}
