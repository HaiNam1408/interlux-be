import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import ApiResponse from 'src/global/api.response';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto, product_images: Express.Multer.File[]): Promise<ApiResponse<any>>;
    findAll(findAllProductsDto: FindAllProductsDto): Promise<ApiResponse<any>>;
    findOne(id: number): Promise<ApiResponse<any>>;
    update(id: number, updateProductDto: UpdateProductDto, images?: Express.Multer.File[]): Promise<ApiResponse<any>>;
    updateStatus(id: number, updateProductStatusDto: UpdateProductStatusDto): Promise<ApiResponse<any>>;
    remove(id: number): Promise<ApiResponse<any>>;
}
