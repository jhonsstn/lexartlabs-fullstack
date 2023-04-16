import { Injectable } from '@nestjs/common';
import { Store } from '../../interfaces/store.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  private convertToCamelCase(stores: Store | Store[]): Store | Store[] {
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

  async getStores(): Promise<Store[]> {
    const stores = await this.prismaService.store.findMany();
    return this.convertToCamelCase(stores) as Store[];
  }

  async getStore(storeId: string): Promise<Store> {
    if (!storeId) return null;
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
    });
    return this.convertToCamelCase(store) as Store;
  }
}
