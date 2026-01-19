import { PrismaService } from 'src/prisma.service';
import { FilesService } from 'src/services/file/file.service';
import { CreateProductVariationDto, UpdateProductVariationDto } from './dto';
export declare class ProductVariationService {
    private readonly prisma;
    private readonly filesService;
    constructor(prisma: PrismaService, filesService: FilesService);
    create(productId: number, createProductVariationDto: CreateProductVariationDto, images: Express.Multer.File[]): Promise<any>;
    findAll(productId: number): Promise<any>;
    findOne(productId: number, id: number): Promise<any>;
    update(productId: number, id: number, updateProductVariationDto: UpdateProductVariationDto, images: Express.Multer.File[]): Promise<any>;
    remove(productId: number, id: number): Promise<void>;
    private transformVariationData;
}
