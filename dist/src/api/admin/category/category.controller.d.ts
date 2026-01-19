import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import ApiResponse from 'src/global/api.response';
import { GetAllCategoryDto } from './dto/get-all-category.dto';
import { FilesService } from 'src/services/file/file.service';
export declare class CategoryController {
    private readonly categoryService;
    private readonly filesService;
    constructor(categoryService: CategoryService, filesService: FilesService);
    findAll({ page, limit, parentId }: GetAllCategoryDto): Promise<ApiResponse<any>>;
    findOne(id: number): Promise<ApiResponse<any>>;
    findBySlug(slug: string): Promise<ApiResponse<any>>;
    create(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File): Promise<ApiResponse<any>>;
    update(id: number, updateCategoryDto: UpdateCategoryDto, image?: Express.Multer.File): Promise<ApiResponse<any>>;
    remove(id: number): Promise<ApiResponse<any>>;
}
