import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from '../../dto/category.dto';
import { CategoryService } from '../../services/category/category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getData(): Promise<CategoryDto[]> {
    return await this.categoryService.getCategories();
  }
}
