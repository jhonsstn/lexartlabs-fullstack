import { Injectable } from '@nestjs/common';
import { ProductInterface } from '../../interfaces/product.interface';
import { ProductSearchParams } from '../../interfaces/searchParams.interface';
import { Term } from '../../interfaces/term.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    product: ProductInterface,
    term: Term,
  ): Promise<ProductInterface> {
    return await this.prismaService.product.create({
      data: {
        ...product,
        terms: {
          connect: {
            id: term.id,
          },
        },
      },
    });
  }

  async createManyProducts(
    products: ProductInterface[],
    term: Term,
  ): Promise<ProductInterface[]> {
    const promises = products.map((product) => {
      return this.createProduct(product, term);
    });
    const createdProducts = await Promise.all(promises);
    const sortedProducts = createdProducts.sort((a, b) =>
      a.title.localeCompare(b.title),
    );
    return sortedProducts;
  }

  async getProducts({
    categoryId,
    storeId,
    searchTerm,
  }: ProductSearchParams): Promise<ProductInterface[]> {
    return this.prismaService.product.findMany({
      where: {
        AND: [
          { categoryId },
          storeId ? { storeId } : null,
          {
            terms: {
              some: {
                term: {
                  equals: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
          },
        ],
      },
      orderBy: { title: 'asc' },
    });
  }
}
