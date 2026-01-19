import { CommonStatus } from '@prisma/client';
export declare class UpdateProductVariationDto {
    sku?: string;
    price?: number;
    percentOff?: number;
    inventory?: number;
    isDefault?: boolean;
    status?: CommonStatus;
}
