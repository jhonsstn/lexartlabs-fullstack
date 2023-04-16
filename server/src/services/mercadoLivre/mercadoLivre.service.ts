import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { MeliSearchParams } from '../../interfaces/searchParams.interface';

@Injectable()
export class MercadoLivreService {
  constructor(private httpService: HttpService) {}

  private makeMeliURL(params: MeliSearchParams) {
    let searchUrl = 'https://api.mercadolibre.com/sites/MLB/search';
    if (params.categoryId) {
      searchUrl += `?category=${params.meliCategory}`;
    }
    if (params.searchTerm) {
      searchUrl += `${params.categoryId ? '&' : '?'}q=${params.searchTerm}`;
    }
    return searchUrl + '&limit=10';
  }

  private makeMeliObjects(results: any[], storeId: string): Product[] {
    return results.map((result: any) => {
      return {
        title: result.title.trim(),
        price: result.price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        image: result.thumbnail,
        link: result.permalink,
        storeId,
        description: [],
      };
    });
  }

  async getData(params: MeliSearchParams): Promise<Product[]> {
    const searchUrl = this.makeMeliURL(params);
    const response = await this.httpService.axiosRef.get(searchUrl);

    const products = this.makeMeliObjects(
      response.data.results,
      params.storeId,
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
