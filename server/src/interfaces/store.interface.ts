import { Prisma } from '@prisma/client';

export interface Store extends Prisma.StoreUncheckedCreateInput {
  camelCaseStore?: string;
}
