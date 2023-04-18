import { Injectable } from '@nestjs/common';
import { StoreInterface } from '../../interfaces/store.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  private convertToCamelCase(
    stores: StoreInterface | StoreInterface[],
  ): StoreInterface | StoreInterface[] {
    if (Array.isArray(stores)) {
      return stores.map((item) => {
        const words = item.store.toLowerCase().split(' ');
        for (let i = 1; i < words.length; i++) {
          words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
        }
        const storeName = words.join('');
        return { ...item, camelCaseStore: storeName };
      });
    } else {
      const words = stores.store.toLowerCase().split(' ');
      for (let i = 1; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
      }
      const storeName = words.join('');
      return { ...stores, camelCaseStore: storeName };
    }
  }

  async getStores(): Promise<StoreInterface[]> {
    const stores = await this.prismaService.store.findMany();
    return this.convertToCamelCase(stores) as StoreInterface[];
  }

  async getStore(storeId: string): Promise<StoreInterface> {
    if (!storeId) return null;
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
    });
    return this.convertToCamelCase(store) as StoreInterface;
  }

  async getStoreByStoreName(store: string) {
    return this.prismaService.store.findFirst({
      where: { store },
    });
  }
}
