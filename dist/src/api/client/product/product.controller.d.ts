import ApiResponse from 'src/global/api.response';
import { ProductClientService } from './product.service';
import { FindAllProductsClientDto } from './dto';
export declare class ProductClientController {
    private readonly productClientService;
    constructor(productClientService: ProductClientService);
    findAll(findAllProductsClientDto: FindAllProductsClientDto): Promise<ApiResponse<any>>;
    getFeaturedProducts(): Promise<ApiResponse<any>>;
    getBestSellingProducts(): Promise<ApiResponse<any>>;
    getNewArrivals(): Promise<ApiResponse<any>>;
    getRelatedProducts(id: number): Promise<ApiResponse<any>>;
    findBySlug(id: number): Promise<ApiResponse<any>>;
    getProductsByCategory(slug: string, findAllProductsClientDto: FindAllProductsClientDto): Promise<ApiResponse<any>>;
    getProductVariations(productId: number): Promise<ApiResponse<any>>;
    getVariationBySku(sku: string): Promise<ApiResponse<any>>;
    getAvailableFilters(categorySlug: string): Promise<ApiResponse<any>>;
}
