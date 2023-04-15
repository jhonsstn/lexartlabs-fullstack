import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { SearchParams } from '../../interfaces/searchParams.interface';

const categoryArray = ['MLB181294', 'MLB1002', 'MLB1055'];

@Injectable()
export class MeliService {
  constructor(private httpService: HttpService) {}

  private makeMeliURL(params: SearchParams) {
    let searchUrl = 'https://api.mercadolibre.com/sites/MLB/search';
    if (params.category) {
      searchUrl += `?category=${categoryArray[params.category]}`;
    }
    if (params.searchTerm) {
      searchUrl += `${params.category ? '&' : '?'}q=${params.searchTerm}`;
    }
    return searchUrl + '&limit=10';
  }

  private makeMeliObjects(results: any[]): Product[] {
    return results.map((result: any) => ({
      title: result.title,
      price: result.original_price,
      image: result.thumbnail,
      link: result.permalink,
      description: [],
    }));
  }

  async getData(params: SearchParams): Promise<Product[]> {
    const searchUrl = this.makeMeliURL(params);
    const response = await this.httpService.axiosRef.get(searchUrl);

    const products = this.makeMeliObjects(response.data.results);

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
