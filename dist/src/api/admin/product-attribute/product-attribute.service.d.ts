import { PrismaService } from 'src/prisma.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto, CreateProductAttributeValueDto, UpdateProductAttributeValueDto } from './dto';
export declare class ProductAttributeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(productId: number, createProductAttributeDto: CreateProductAttributeDto): Promise<any>;
    findAll(productId: number): Promise<any>;
    findOne(productId: number, id: number): Promise<any>;
    update(productId: number, id: number, updateProductAttributeDto: UpdateProductAttributeDto): Promise<any>;
    remove(productId: number, id: number): Promise<void>;
    createValue(productId: number, attributeId: number, createProductAttributeValueDto: CreateProductAttributeValueDto): Promise<any>;
    findAllValues(productId: number, attributeId: number): Promise<any>;
    updateValue(productId: number, attributeId: number, valueId: number, updateProductAttributeValueDto: UpdateProductAttributeValueDto): Promise<any>;
    removeValue(productId: number, attributeId: number, valueId: number): Promise<void>;
}
