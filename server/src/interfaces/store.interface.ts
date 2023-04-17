import { Store } from '@prisma/client';

export interface StoreInterface extends Store {
  camelCaseStore?: string;
}
