import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductVariationOptionDto {
    @ApiProperty({ description: 'ID variation option' })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    variationOptionId: number;
}