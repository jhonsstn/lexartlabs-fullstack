import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../interfaces/product.interface';
import { BuscapeService } from './buscape.service';

@Controller('search')
export class BuscapeController {
  constructor(private readonly buscapeService: BuscapeService) {}

  @Get()
  async getData(
    @Query('category') category: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { category, searchTerm };
    const data = await this.buscapeService.getData(params);
    return data;
  }
}
