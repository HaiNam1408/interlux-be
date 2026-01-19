import { CommonStatus } from '@prisma/client';
export declare class UpdateProductAttributeValueDto {
    name?: string;
    value?: string;
    sort?: number;
    status?: CommonStatus;
}
