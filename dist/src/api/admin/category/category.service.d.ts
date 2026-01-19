import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationService } from 'src/utils/pagination.util';
import { FilesService } from 'src/services/file/file.service';
export declare class CategoryService {
    private readonly prismaService;
    private readonly pagination;
    private readonly filesService;
    constructor(prismaService: PrismaService, pagination: PaginationService, filesService: FilesService);
    findAll(page?: number, limit?: number, parentId?: number): Promise<any>;
    findOne(id: number): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    create(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File): Promise<any>;
    update(id: number, updateCategoryDto: UpdateCategoryDto, image?: Express.Multer.File): Promise<any>;
    remove(id: number): Promise<void>;
    private isChildOf;
}
