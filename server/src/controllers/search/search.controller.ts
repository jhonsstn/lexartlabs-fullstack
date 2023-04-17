import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { CategoryService } from '../../services/category/category.service';
import { MercadoLivreService } from '../../services/mercadoLivre/mercadoLivre.service';
import { PrismaService } from '../../services/prisma/prisma.service';
import { ProductService } from '../../services/product/product.service';
import { StoreService } from '../../services/store/store.service';
import { TermService } from '../../services/term/term.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly mercadoLivreService: MercadoLivreService,
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly termService: TermService,
  ) {}

  @Get()
  async getData(
    @Query('storeid') storeId: string,
    @Query('categoryid') categoryId: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { categoryId, searchTerm, storeId };

    const existingProducts = await this.productService.getProducts(params);

    if (existingProducts.length > 0) {
      return existingProducts.map((product) => ({ ...product, font: 'db' }));
    }

    let products = [];

    const store = await this.storeService.getStore(storeId);
    console.log(store);
    const stores = await this.storeService.getStores();
    console.log(stores);

    const storeCategories = await this.categoryService.getCategory(categoryId);
    console.log(storeCategories);

    for (const { camelCaseStore } of stores) {
      if (!store || store.camelCaseStore === camelCaseStore) {
        const storeData = await this[`${camelCaseStore}Service`].getData({
          ...params,
          [`${camelCaseStore}Category`]:
            storeCategories[`${camelCaseStore}Category`],
          storeId: stores.find((item) => item.camelCaseStore === camelCaseStore)
            .id,
        });
        products = [...products, ...storeData];
      }
    }

    const sortedProducts = products.sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    const productsWithCategory = sortedProducts.map((product) => ({
      ...product,
      categoryId,
    }));

    const createdTerm = await this.termService.createOrGetTerm(searchTerm);

    const insertedProducts = await this.productService.createManyProducts(
      productsWithCategory,
      createdTerm,
    );

    return insertedProducts.map((product) => ({ ...product, font: 'api' }));
  }
}
