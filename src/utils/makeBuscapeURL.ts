import { SearchParams } from '../interfaces/SearchParams.interface';

const makeBuscapeURL = (params: SearchParams) => {
  let searchUrl = `https://www.buscape.com.br/search`;

  if (params.category) {
    searchUrl += `?refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=${params.category}`;
  }

  if (params.searchTerm) {
    searchUrl += `${params.category ? '&' : '?'}q=${params.searchTerm}`;
  }
  return searchUrl;
};

export { makeBuscapeURL };
