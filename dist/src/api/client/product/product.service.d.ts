import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/utils/pagination.util';
export declare class ProductClientService {
    private readonly prisma;
    private readonly pagination;
    constructor(prisma: PrismaService, pagination: PaginationService);
    findAll(params: {
        page?: number;
        limit?: number;
        categoryId?: number;
        search?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        minPrice?: number;
        maxPrice?: number;
        attributes?: string;
    }): Promise<any>;
    findBySlug(id: number): Promise<any>;
    getFeaturedProducts(): Promise<any>;
    getBestSellingProducts(): Promise<any>;
    getNewArrivals(): Promise<any>;
    getRelatedProducts(productId: number): Promise<any>;
    getProductsByCategory(categorySlug: string, params: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        minPrice?: number;
        maxPrice?: number;
        attributes?: string;
    }): Promise<any>;
    getProductVariations(productId: number): Promise<any>;
    getVariationBySku(sku: string): Promise<any>;
    getAvailableFilters(categorySlug: string): Promise<any>;
    private transformProductData;
    private transformVariationData;
}
