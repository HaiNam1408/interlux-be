import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllPostsDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Transform(({ value }) => value ? parseInt(value) : 1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10 })
    @IsInt()
    @IsOptional()
    @Min(1)
    @Transform(({ value }) => value ? parseInt(value) : 10)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Filter by status',
        enum: PostStatus,
    })
    @IsEnum(PostStatus)
    @IsOptional()
    status?: PostStatus;

    @ApiPropertyOptional({ description: 'Search by title or content' })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by tag ID' })
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => value ? parseInt(value) : undefined)
    tagId?: number;
}
