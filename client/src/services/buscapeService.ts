import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Product } from '../interfaces/Product.interface';
import { makeBuscapeURL } from '../utils/makeBuscapeURL';

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

const getBuscapeProductLinks = (
  document: Document,
  linkSelector: string
): string[] => {
  const links = Array.from(document.querySelectorAll(linkSelector)).map(
    (link) => `${BASE_URL}${link.getAttribute('href')}`
  );

  return links;
};

const getBuscapeProductData = async (link: string): Promise<Product> => {
  const response = await axios.get(link);

  const dom = new JSDOM(response.data);

  const title = dom.window.document.querySelector(titleSelector)?.textContent;

  const image = dom.window.document
    .querySelectorAll(imageSelector)[0]
    .getAttribute('src');
  const price = dom.window.document.querySelector(priceSelector)?.textContent;

  const description = Array.from(
    dom.window.document.querySelectorAll(descriptionSelector)
  ).map((el) => el.textContent);

  return {
    title: title || '',
    image: image || '',
    price: price || '',
    link,
    description: description,
  };
};

const getData = async (params: SearchParams): Promise<Product[]> => {
  const url = makeBuscapeURL(params);

  const response = await axios.get(url);

  const dom = new JSDOM(response.data);

  const links = getBuscapeProductLinks(dom.window.document, linkSelector);

  const products = await Promise.all(
    links.map((link) => getBuscapeProductData(link))
  );
  return products;
};

export { getData };
