import { CommonStatus } from '@prisma/client';
export declare class CreateProductAttributeValueDto {
    name: string;
    value?: string;
    sort?: number;
    status?: CommonStatus;
}
