import { ProductVariationService } from './product-variation.service';
import { CreateProductVariationDto, UpdateProductVariationDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class ProductVariationController {
    private readonly productVariationService;
    constructor(productVariationService: ProductVariationService);
    create(productId: number, createProductVariationDto: CreateProductVariationDto, images: Express.Multer.File[]): Promise<ApiResponse<any>>;
    findAll(productId: number): Promise<ApiResponse<any>>;
    findOne(productId: number, id: number): Promise<ApiResponse<any>>;
    update(productId: number, id: number, updateProductVariationDto: UpdateProductVariationDto, images: Express.Multer.File[]): Promise<ApiResponse<any>>;
    remove(productId: number, id: number): Promise<ApiResponse<any>>;
}
