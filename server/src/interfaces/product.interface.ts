import { Product } from '@prisma/client';

export interface ProductInterface extends Product {
  id: string;
  description: string[];
}
