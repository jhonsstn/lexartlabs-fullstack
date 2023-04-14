// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import getData from '../../services/buscapeService';

type Product = {
  title: string;
  image: string;
  price: string;
  link: string;
  description: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  const data = await getData(req.query.q as string);
  res.status(200).json(data);
}
