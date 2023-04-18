import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProductInterface } from '../../interfaces/product.interface';
import { MercadoLivreSearchParams } from '../../interfaces/searchParams.interface';
import { StoreService } from '../store/store.service';

@Injectable()
export class MercadoLivreService {
  constructor(
    private httpService: HttpService,
    private readonly storeService: StoreService,
  ) {}

  private makeMeliURL(params: MercadoLivreSearchParams) {
    let searchUrl = 'https://api.mercadolibre.com/sites/MLB/search';
    if (params.categoryId) {
      searchUrl += `?category=${params.mercadoLivreCategory}`;
    }
    if (params.searchTerm) {
      searchUrl += `${params.mercadoLivreCategory ? '&' : '?'}q=${
        params.searchTerm
      }`;
    }
    return searchUrl + '&limit=10';
  }

  private async makeMeliObjects(
    results: any[],
    storeId: string,
    categoryId: string,
  ): Promise<Omit<ProductInterface, 'id'>[]> {
    const promises = results.map(async (result: any) => {
      return {
        title: result.title.trim(),
        price: result.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        image: result.thumbnail,
        link: result.permalink,
        storeId:
          storeId ||
          (await this.storeService.getStoreByStoreName('Mercado Livre')).id,
        categoryId,
        description: [],
      };
    });
    return await Promise.all(promises);
  }

  async getData(
    params: MercadoLivreSearchParams,
  ): Promise<Omit<ProductInterface, 'id'>[]> {
    const searchUrl = this.makeMeliURL(params);
    const response = await this.httpService.axiosRef.get(searchUrl);

    const products = await this.makeMeliObjects(
      response.data.results,
      params.storeId,
      params.mercadoLivreCategory,
    );

    const productsWithDescription = await Promise.all(
      products.map(async (product, index) => {
        const descriptionResponse = await this.httpService.axiosRef.get(
          `https://api.mercadolibre.com/items/${response.data.results[index].id}/description`,
        );
        return {
          ...product,
          description: [descriptionResponse.data.plain_text],
        };
      }),
    );

    return productsWithDescription;
  }
}
