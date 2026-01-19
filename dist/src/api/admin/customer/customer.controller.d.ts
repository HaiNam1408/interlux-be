import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto, GetAllCustomersDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    findAll({ page, limit, search }: GetAllCustomersDto): Promise<ApiResponse<any>>;
    findOne(id: number): Promise<ApiResponse<any>>;
    getUserOrders(id: number, page?: number, limit?: number): Promise<ApiResponse<any>>;
    create(createCustomerDto: CreateCustomerDto, avatar?: Express.Multer.File): Promise<ApiResponse<any>>;
    update(id: number, updateCustomerDto: UpdateCustomerDto, avatar?: Express.Multer.File): Promise<ApiResponse<any>>;
    remove(id: number): Promise<ApiResponse<any>>;
}
