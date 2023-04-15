import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Product } from '../interfaces/product.interface';

const BASE_URL = 'https://www.buscape.com.br';
const linkSelector = '.SearchCard_ProductCard_Inner__7JhKb';
const titleSelector = 'h1.Text_Text__h_AF6';
const imageSelector = '.Carousel_SlideItem__c7xrN img';
const priceSelector = 'div.Price_ValueContainer__1U9ia strong:first-child';
const descriptionSelector =
  'div.AttributeBlock_GroupContent__nhYRo.AttributeBlock_NoBorders__UgSGr p.Text_Text__h_AF6.Text_MobileLabelS___fuke';

export type SearchParams = {
  category?: string;
  searchTerm?: string;
};

@Injectable()
export class BuscapeService {
  // constructor(private readonly axiosInstance: AxiosInstance) {}

  private makeBuscapeURL(params: SearchParams) {
    let searchUrl = `https://www.buscape.com.br/search`;
    if (params.category) {
      searchUrl += `?refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=${params.category}`;
    }
    if (params.searchTerm) {
      searchUrl += `${params.category ? '&' : '?'}q=${params.searchTerm}`;
    }
    return searchUrl;
  }

  private getBuscapeProductLinks(document: Document): string[] {
    const links = Array.from(document.querySelectorAll(linkSelector)).map(
      (link) => `${BASE_URL}${link.getAttribute('href')}`,
    );
    return links;
  }

  private async getBuscapeProductData(link: string): Promise<Product> {
    const response = await axios.get(link);
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
      title,
      image,
      price,
      link,
      description,
    };
  }

  async getData(params: SearchParams): Promise<Product[]> {
    const url = this.makeBuscapeURL(params);
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const links = this.getBuscapeProductLinks(dom.window.document);
    const products = await Promise.all(
      links.map((link) => this.getBuscapeProductData(link)),
    );
    return products;
  }
}
