import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { CategoryService } from '../../services/category/category.service';
import { MeliService } from '../../services/meli/meli.service';
import { PrismaService } from '../../services/prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly meliService: MeliService,
    private readonly categoryService: CategoryService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getData(
    @Query('categoryid') categoryId: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { categoryId, searchTerm };

    console.log(categoryId);

    const storeCategories = await this.categoryService.getCategory(categoryId);

    console.log(storeCategories);

    const buscapeData = await this.buscapeService.getData({
      ...params,
      buscapeCategory: storeCategories.buscapeCategory,
    });

    const meliData = await this.meliService.getData({
      ...params,
      meliCategory: storeCategories.meliCategory,
    });

    const products = [...buscapeData, ...meliData].sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    const productsWithCategory = products.map((product) => ({
      ...product,
      categoryId,
    }));

    const promises = productsWithCategory.map((product) =>
      this.prismaService.product.create({ data: product }),
    );

    const insertedProducts = await Promise.all(promises);

    return insertedProducts;
  }
}
