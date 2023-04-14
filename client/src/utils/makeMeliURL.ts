import { SearchParams } from '../interfaces/SearchParams.interface';

const makeMeliURL = (params: SearchParams) => {
  let searchUrl = 'https://api.mercadolibre.com/sites/MLB/search';

  if (params.category) {
    searchUrl += `?category=${params.category}`;
  }

  if (params.searchTerm) {
    searchUrl += `${params.category ? '&' : '?'}q=${params.searchTerm}`;
  }

  return searchUrl;
};

export { makeMeliURL };
