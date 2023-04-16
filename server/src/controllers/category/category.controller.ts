import { Controller, Get } from '@nestjs/common';
import { Category } from '../../interfaces/category.interface';

import { CategoryService } from '../../services/category/category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getData(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }
}
