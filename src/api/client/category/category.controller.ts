import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("category")
@Controller('category')
export class CategoryController {}
