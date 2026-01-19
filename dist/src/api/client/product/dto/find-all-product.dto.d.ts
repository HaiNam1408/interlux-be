export declare class FindAllProductsClientDto {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    attributes?: string;
}
