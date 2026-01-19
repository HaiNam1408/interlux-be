import { OrderService } from './order.service';
import { GetAllOrdersDto, UpdateOrderStatusDto } from './dto';
import ApiResponse from 'src/global/api.response';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    findAll(query: GetAllOrdersDto): Promise<ApiResponse<any>>;
    findOne(id: number): Promise<ApiResponse<any>>;
    updateStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<ApiResponse<any>>;
    getOrderStatistics(): Promise<ApiResponse<any>>;
}
