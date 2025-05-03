import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductVariationValueDto {
    @ApiProperty({ description: 'ID of the product attribute value' })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    attributeValueId: number;
}
