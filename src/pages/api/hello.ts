// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

type Product = {
  title: string;
  image: string;
  price: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[]>
) {
  const data = await getData(req.query.term as string);
  res.status(200).json(data);
}

const getData = async (searchTerm: string): Promise<Product[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setViewport({ width: 1920, height: 10000 });

  await page.goto(
    `https://www.buscape.com.br/search?q=${encodeURIComponent(searchTerm)}`
  );

  const titleSelector = '.SearchCard_ProductCard_Name__ZaO5o';
  const imageSelector = '.SearchCard_ProductCard_Image__ffKkn span img';
  const priceSelector = '.Text_Text__h_AF6.Text_MobileHeadingS__Zxam2';

  const data = await page.evaluate(
    (titleSelector, imageSelector, priceSelector) => {
      const titles = Array.from(document.querySelectorAll(titleSelector));
      const images = Array.from(document.querySelectorAll(imageSelector));
      const prices = Array.from(document.querySelectorAll(priceSelector));

      return titles.map((title, index) => ({
        title: (title as HTMLElement)?.textContent?.trim() ?? '',
        image: images[index].getAttribute('src') ?? '',
        price: prices[index].textContent?.trim() ?? '',
      }));
    },
    titleSelector,
    imageSelector,
    priceSelector
  );
  await browser.close();
  return data;
};
