import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { CategoryService } from '../../services/category/category.service';
import { MeliService } from '../../services/meli/meli.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { StoreService } from '../../services/store/store.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly meliService: MeliService,
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getData(
    @Query('storeid') storeId: string,
    @Query('categoryid') categoryId: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { categoryId, searchTerm };

    let products = [];

    const store = await this.storeService.getStore(storeId);

    const storeCategories = await this.categoryService.getCategory(categoryId);

    if (!store || store.store === 'Buscape') {
      const buscapeData = await this.buscapeService.getData({
        ...params,
        buscapeCategory: storeCategories.buscapeCategory,
        storeId: await this.storeService
          .getStoreByStoreName('Buscape')
          .then((res) => res.id),
      });
      products = [...products, ...buscapeData];
    }

    if (!store || store.store === 'Mercado Livre') {
      const meliData = await this.meliService.getData({
        ...params,
        meliCategory: storeCategories.meliCategory,
        storeId: await this.storeService
          .getStoreByStoreName('Mercado Livre')
          .then((res) => res.id),
      });
      products = [...products, ...meliData];
    }

    const sortedProducts = products.sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    const productsWithCategory = sortedProducts.map((product) => ({
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
