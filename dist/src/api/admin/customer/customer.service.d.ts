import { PrismaService } from 'src/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { PaginationService } from 'src/utils/pagination.util';
import { FilesService } from 'src/services/file/file.service';
export declare class CustomerService {
    private readonly prismaService;
    private readonly pagination;
    private readonly filesService;
    constructor(prismaService: PrismaService, pagination: PaginationService, filesService: FilesService);
    findAll(page?: number, limit?: number, search?: string): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createCustomerDto: CreateCustomerDto, avatar?: Express.Multer.File): Promise<any>;
    update(id: number, updateCustomerDto: UpdateCustomerDto, avatar?: Express.Multer.File): Promise<any>;
    remove(id: number): Promise<void>;
    getUserOrders(userId: number, page?: number, limit?: number): Promise<any>;
}
