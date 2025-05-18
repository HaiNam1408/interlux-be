import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { 
    IsString, 
    IsOptional, 
    IsEnum, 
    IsArray, 
    IsInt, 
    ValidateNested,
    IsNotEmpty
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
    @ApiProperty({ description: 'Post title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Post content' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ description: 'Post description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'Meta title for SEO' })
    @IsString()
    @IsOptional()
    metaTitle?: string;

    @ApiPropertyOptional({ description: 'Meta description for SEO' })
    @IsString()
    @IsOptional()
    metaDescription?: string;

    @ApiPropertyOptional({
        description: 'Post status',
        enum: PostStatus,
        default: PostStatus.DRAFT,
    })
    @IsEnum(PostStatus)
    @IsOptional()
    status?: PostStatus;

    @ApiPropertyOptional({
        description: 'Published date (ISO string)',
        type: String,
    })
    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    publishedAt?: Date;

    @ApiPropertyOptional({
        description: 'Tag IDs',
        type: [Number],
    })
    @IsArray()
    @IsInt({ each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value.map(v => typeof v === 'string' ? parseInt(v) : v);
        }
        return value ? [parseInt(value)] : [];
    })
    @IsOptional()
    tagIds?: number[];

    @ApiProperty({
        description: "Thumbnail image",
        type: String,
        format: "binary",
        required: false,
    })
    @IsOptional()
    thumbnail?: any;
}
