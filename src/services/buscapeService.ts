import puppeteer from 'puppeteer';

const BASE_URL = 'https://www.buscape.com.br';

interface Product {
  title: string;
  image: string;
  price: string;
  link: string;
  description: string;
}

const getData = async (searchTerm: string): Promise<Product[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setViewport({ width: 1920, height: 10000 });

  await page.goto(`${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`);

  const titleSelector = '.SearchCard_ProductCard_Name__ZaO5o';
  const imageSelector = '.SearchCard_ProductCard_Image__ffKkn span img';
  const priceSelector = '.Text_Text__h_AF6.Text_MobileHeadingS__Zxam2';
  const linkSelector = '.SearchCard_ProductCard_Inner__7JhKb';
  const descriptionSelector =
    'div.AttributeBlock_GroupContent__nhYRo.AttributeBlock_NoBorders__UgSGr p.Text_Text__h_AF6.Text_MobileLabelS___fuke';

  const data = await page.evaluate(
    (titleSelector, imageSelector, priceSelector, linkSelector) => {
      const titles = Array.from(document.querySelectorAll(titleSelector));
      const images = Array.from(document.querySelectorAll(imageSelector));
      const prices = Array.from(document.querySelectorAll(priceSelector));
      const links = Array.from(document.querySelectorAll(linkSelector));

      return titles.map((title, index) => ({
        title: (title as HTMLElement)?.textContent?.trim() ?? '',
        image: images[index].getAttribute('src') ?? '',
        price: prices[index].textContent?.trim() ?? '',
        link: `https://www.buscape.com.br${
          links[index].getAttribute('href') ?? ''
        }`,
        description: '',
      }));
    },
    titleSelector,
    imageSelector,
    priceSelector,
    linkSelector
  );

  for (const product of data) {
    const productPage = await browser.newPage();
    await productPage.goto(product.link);
    const description = await productPage.evaluate((descriptionSelector) => {
      const descEl = document.querySelector(descriptionSelector);
      return descEl?.textContent?.trim() ?? '';
    }, descriptionSelector);
    await productPage.close();
    product.description = description;
  }

  await browser.close();
  return data;
};

export default getData;
