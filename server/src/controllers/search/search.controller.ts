import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { CategoryService } from '../../services/category/category.service';
import { MercadoLivreService } from '../../services/mercadoLivre/mercadoLivre.service';
// import { PrismaService } from '../../services/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { ProductDto } from '../../dto/product.dto';
import { ProductService } from '../../services/product/product.service';
import { StoreService } from '../../services/store/store.service';
import { TermService } from '../../services/term/term.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly mercadoLivreService: MercadoLivreService,
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
    // private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly termService: TermService,
  ) {}

  @Get()
  async getData(
    @Query('storeid') storeId: string,
    @Query('categoryid') categoryId: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<ProductDto[]> {
    const params = { categoryId, searchTerm, storeId };

    if (!categoryId || Array.isArray(params.categoryId)) {
      throw new HttpException(
        'Bad Request: Category missing or more than one',
        400,
      );
    }

    if (Array.isArray(params.storeId)) {
      throw new HttpException('Bad Request: More than one store', 400);
    }

    if (!params.searchTerm || Array.isArray(params.searchTerm)) {
      throw new HttpException(
        'Bad Request: Category missing or more than one',
        400,
      );
    }

    const existingProducts = await this.productService.getProducts(params);

    if (existingProducts.length > 0) {
      return existingProducts.map((product) => ({ ...product, font: 'db' }));
    }

    let products = [];

    const store = await this.storeService.getStore(storeId);

    const storeCategories = await this.categoryService.getCategory(categoryId);

    // Comentei o codigo abaixo pois apesar de permitir a busca em deiversas lojas, para o contexto atual do projeto, não é necessário e fica menos claro.

    // const stores = await this.storeService.getStores();

    // for (const { camelCaseStore } of stores) {
    //   if (!store || store.camelCaseStore === camelCaseStore) {
    //     const storeData = await this[`${camelCaseStore}Service`].getData({
    //       ...params,
    //       [`${camelCaseStore}Category`]:
    //         storeCategories[`${camelCaseStore}Category`],
    //       storeId: stores.find((item) => item.camelCaseStore === camelCaseStore)
    //         .id,
    //     });
    //     products = [...products, ...storeData];
    //   }
    // }

    // Codigo acima substitui os ifs abaixo que são mais claros, mas não permitem a busca em diversas lojas.

    if (!store || store.camelCaseStore === 'buscape') {
      const buscapeData = await this.buscapeService.getData({
        ...params,
        buscapeCategory: storeCategories.buscapeCategory,
      });
      products = [...products, ...buscapeData];
    }

    if (!store || store.camelCaseStore === 'mercadoLivre') {
      const mercadoLivreData = await this.mercadoLivreService.getData({
        ...params,
        mercadoLivreCategory: storeCategories.mercadoLivreCategory,
      });
      products = [...products, ...mercadoLivreData];
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
