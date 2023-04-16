import { Injectable } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { ProductSearchParams } from '../../interfaces/searchParams.interface';
import { Term } from '../../interfaces/term.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(product: Product, term: Term): Promise<Product> {
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
    products: Product[],
    term: Term,
  ): Promise<Product[]> {
    const promises = products.map((product) => {
      return this.createProduct(product, term);
    });
    const createdProducts = await Promise.all(promises);
    return createdProducts;
  }

  async getProducts({
    categoryId,
    storeId,
    searchTerm,
  }: ProductSearchParams): Promise<Product[]> {
    return this.prismaService.product.findMany({
      where: {
        AND: [
          { categoryId },
          { storeId },
          { terms: { some: { term: searchTerm } } },
        ],
      },
      orderBy: { title: 'asc' },
    });
  }
}
