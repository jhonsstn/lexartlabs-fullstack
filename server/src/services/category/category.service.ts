import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategory(categoryId: string) {
    return this.prismaService.category.findUnique({
      where: { id: categoryId },
    });
  }
}
