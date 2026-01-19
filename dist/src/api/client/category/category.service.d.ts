import { PrismaService } from 'src/prisma.service';
export declare class CategoryClientService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCategoryMenu(): Promise<any>;
    getFeaturedCategories(): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    getSubcategories(slug: string): Promise<any>;
    getCategoryBreadcrumb(slug: string): Promise<any>;
    private formatCategoryForMenu;
    private parseImageData;
}
