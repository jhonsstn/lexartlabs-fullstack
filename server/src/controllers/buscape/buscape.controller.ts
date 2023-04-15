import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { MeliService } from '../../services/meli/meli.service';

@Controller('search')
export class BuscapeController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly meliService: MeliService,
  ) {}

  @Get()
  async getData(
    @Query('category') category: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { category, searchTerm };
    const buscapeData = await this.buscapeService.getData(params);
    const meliData = await this.meliService.getData(params);
    return [...buscapeData, ...meliData].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }
}
