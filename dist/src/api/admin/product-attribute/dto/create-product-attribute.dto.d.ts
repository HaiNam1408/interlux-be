import { CommonStatus } from '@prisma/client';
import { CreateProductAttributeValueDto } from './create-product-attribute-value.dto';
export declare class CreateProductAttributeDto {
    name: string;
    sort?: number;
    status?: CommonStatus;
    values: CreateProductAttributeValueDto[];
}
