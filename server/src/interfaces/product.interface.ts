import { Prisma } from '@prisma/client';

export interface Product extends Prisma.ProductUncheckedCreateInput {
  id?: string;
}
