import { Controller, Get } from '@nestjs/common';
import { Store } from '../../interfaces/store.interface';
import { StoreService } from '../../services/store/store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getStores(): Promise<Store[]> {
    return await this.storeService.getStores();
  }
}
