import ApiResponse from 'src/global/api.response';
import { CategoryClientService } from './category.service';
export declare class CategoryClientController {
    private readonly categoryClientService;
    constructor(categoryClientService: CategoryClientService);
    getCategoryMenu(): Promise<ApiResponse<any>>;
    getFeaturedCategories(): Promise<ApiResponse<any>>;
    findBySlug(slug: string): Promise<ApiResponse<any>>;
    getSubcategories(slug: string): Promise<ApiResponse<any>>;
    getCategoryBreadcrumb(slug: string): Promise<ApiResponse<any>>;
}
