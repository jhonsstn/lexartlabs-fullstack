import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreDto } from '../../dto/store.dto';
import { StoreService } from '../../services/store/store.service';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getStores(): Promise<StoreDto[]> {
    return await this.storeService.getStores();
  }
}
