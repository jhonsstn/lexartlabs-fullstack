// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '../../interfaces/Product.interface';
import * as buscapeService from '../../services/buscapeService';
import * as meliService from '../../services/meliService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  const params = {
    category: req.query.category as string,
    searchTerm: req.query.searchterm as string,
  };
  const data = await buscapeService.getData(params);
  res.status(200).json(data);
}
