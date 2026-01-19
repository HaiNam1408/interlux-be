import { OrderStatus } from '@prisma/client';
export declare class GetAllOrdersDto {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
    userId?: number;
}
