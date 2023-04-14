import axios from 'axios';
import { SearchParams } from '../interfaces/SearchParams.interface';
import { makeMeliURL } from '../utils/makeMeliURL';

//TODO: Corrigir o tipo de retorno e criar interface
interface SearchResult {
  id: string;
  title: string;
  price: number;
  currency_id: string;
}

const getData = async (params: SearchParams): Promise<SearchResult[]> => {
  const searchUrl = makeMeliURL(params);

  const response = await axios.get(searchUrl);

  return response.data.results.map((result: any) => ({
    id: result.id,
    title: result.title,
    price: result.price,
    currency_id: result.currency_id,
  }));
};

export { getData };
