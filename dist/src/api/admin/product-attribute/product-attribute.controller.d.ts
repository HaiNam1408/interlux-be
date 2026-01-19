import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class ProductAttributeController {
    private readonly productAttributeService;
    constructor(productAttributeService: ProductAttributeService);
    create(productId: number, createProductAttributeDto: CreateProductAttributeDto): Promise<ApiResponse<any>>;
    findAll(productId: number): Promise<ApiResponse<any>>;
    findOne(productId: number, id: number): Promise<ApiResponse<any>>;
    update(productId: number, id: number, updateProductAttributeDto: UpdateProductAttributeDto): Promise<ApiResponse<any>>;
    remove(productId: number, id: number): Promise<ApiResponse<any>>;
    createValue(productId: number, attributeId: number, createProductAttributeValueDto: CreateProductAttributeValueDto): Promise<ApiResponse<any>>;
    findAllValues(productId: number, attributeId: number): Promise<ApiResponse<any>>;
    updateValue(productId: number, attributeId: number, valueId: number, updateProductAttributeValueDto: UpdateProductAttributeValueDto): Promise<ApiResponse<any>>;
    removeValue(productId: number, attributeId: number, valueId: number): Promise<ApiResponse<any>>;
}
