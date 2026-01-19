import { CommonStatus } from '@prisma/client';
export declare class CreateProductVariationDto {
    sku: string;
    price?: number;
    percentOff?: number;
    inventory?: number;
    isDefault?: boolean;
    status?: CommonStatus;
    attributeValues: number[];
}
