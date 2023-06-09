import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { ProductInterface } from '../../interfaces/product.interface';
import { BuscapeSearchParams } from '../../interfaces/searchParams.interface';
import { StoreService } from '../store/store.service';

const BASE_URL = 'https://www.buscape.com.br';
const linkSelector = '.SearchCard_ProductCard_Inner__7JhKb';
const titleSelector = 'h1.Text_Text__h_AF6';
const imageSelector = '.Carousel_SlideItem__c7xrN img';
const priceSelector = 'div.Price_ValueContainer__1U9ia strong:first-child';
const descriptionSelector =
  'div.AttributeBlock_GroupContent__nhYRo.AttributeBlock_NoBorders__UgSGr p.Text_Text__h_AF6.Text_MobileLabelS___fuke';

@Injectable()
export class BuscapeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly storeService: StoreService,
  ) {}

  private makeBuscapeURL(params: BuscapeSearchParams) {
    let searchUrl = `https://www.buscape.com.br/search`;
    if (params.buscapeCategory) {
      searchUrl += `?refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=${params.buscapeCategory}`;
    }
    if (params.searchTerm) {
      searchUrl += `${params.buscapeCategory ? '&' : '?'}q=${
        params.searchTerm
      }`;
    }
    return searchUrl;
  }

  private getBuscapeProductLinks(document: Document): string[] {
    const links = Array.from(document.querySelectorAll(linkSelector)).map(
      (link) => `${BASE_URL}${link.getAttribute('href')}`,
    );
    return links;
  }

  private async getBuscapeProductData(
    link: string,
    storeId: string,
    categoryId: string,
  ): Promise<Omit<ProductInterface, 'id'>> {
    const response = await this.httpService.axiosRef.get(link);
    const dom = new JSDOM(response.data);
    const title =
      dom.window.document.querySelector(titleSelector)?.textContent ?? '';
    const image =
      dom.window.document
        .querySelectorAll(imageSelector)[0]
        ?.getAttribute('src') ?? '';
    const price =
      dom.window.document.querySelector(priceSelector)?.textContent ?? '';
    const description = Array.from(
      dom.window.document.querySelectorAll(descriptionSelector),
    ).map((el) => el.textContent);
    return {
      title: title.trim(),
      image,
      price,
      link,
      storeId:
        storeId || (await this.storeService.getStoreByStoreName('Buscape')).id,
      categoryId,
      description: description,
    };
  }

  async getData(
    params: BuscapeSearchParams,
  ): Promise<Omit<ProductInterface, 'id'>[]> {
    const url = this.makeBuscapeURL(params);
    const response = await this.httpService.axiosRef.get(url);
    const dom = new JSDOM(response.data);
    const links = this.getBuscapeProductLinks(dom.window.document);
    const products = await Promise.all(
      links.map((link) =>
        this.getBuscapeProductData(
          link,
          params.storeId,
          params.buscapeCategory,
        ),
      ),
    );
    return products;
  }
}
