import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { GetAllTagsDto } from './dto/get-all-tags.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import ApiResponse from 'src/global/api.response';
import { resError } from 'src/global/handleError.global';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('Admin - Tag')
@Controller('tag')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @ApiOperation({ summary: 'Get all tags' })
    @Get()
    async findAll(
        @Query() { page = 1, limit = 10, search }: GetAllTagsDto,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.tagService.findAll(page, limit, search);
            return new ApiResponse(
                'Tags retrieved successfully',
                HttpStatus.OK,
                result
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get all tags (no pagination)' })
    @Get('all')
    async getAllTags(): Promise<ApiResponse<any>> {
        try {
            const tags = await this.tagService.getAllTags();
            return new ApiResponse(
                'Tags retrieved successfully',
                HttpStatus.OK,
                tags
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get tag by ID' })
    @ApiParam({ name: 'id', type: Number })
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            const tag = await this.tagService.findOne(id);
            return new ApiResponse(
                'Tag retrieved successfully',
                HttpStatus.OK,
                tag
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Get tag by slug' })
    @ApiParam({ name: 'slug', type: String })
    @Get('slug/:slug')
    async findBySlug(
        @Param('slug') slug: string
    ): Promise<ApiResponse<any>> {
        try {
            const tag = await this.tagService.findBySlug(slug);
            return new ApiResponse(
                'Tag retrieved successfully',
                HttpStatus.OK,
                tag
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Create a new tag' })
    @ApiBody({
        description: "Create Tag",
        type: CreateTagDto,
    })
    @Post()
    async create(
        @Body() createTagDto: CreateTagDto
    ): Promise<ApiResponse<any>> {
        try {
            const tag = await this.tagService.create(createTagDto);
            return new ApiResponse(
                'Tag created successfully',
                HttpStatus.CREATED,
                tag
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Update tag' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        description: "Update Tag",
        type: UpdateTagDto,
    })
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTagDto: UpdateTagDto
    ): Promise<ApiResponse<any>> {
        try {
            const tag = await this.tagService.update(id, updateTagDto);
            return new ApiResponse(
                'Tag updated successfully',
                HttpStatus.OK,
                tag
            );
        } catch (error) {
            return resError(error);
        }
    }

    @ApiOperation({ summary: 'Delete tag' })
    @ApiParam({ name: 'id', type: Number })
    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<any>> {
        try {
            await this.tagService.remove(id);
            return new ApiResponse(
                'Tag deleted successfully',
                HttpStatus.OK,
                null
            );
        } catch (error) {
            return resError(error);
        }
    }
}
