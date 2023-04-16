import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStores() {
    return this.prismaService.store.findMany();
  }

  async getStore(storeId: string) {
    if (!storeId) return null;
    return this.prismaService.store.findUnique({
      where: { id: storeId },
    });
  }

  async getStoreByStoreName(store: string) {
    return this.prismaService.store.findFirst({
      where: { store },
    });
  }
}
