import { Controller, Get, Query } from '@nestjs/common';
import { Product } from '../../interfaces/product.interface';
import { BuscapeService } from '../../services/buscape/buscape.service';
import { MeliService } from '../../services/meli/meli.service';
import { PrismaService } from '../../services/prisma/prisma.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly buscapeService: BuscapeService,
    private readonly meliService: MeliService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getData(
    @Query('category') category: string,
    @Query('searchterm') searchTerm: string,
  ): Promise<Product[]> {
    const params = { category, searchTerm };

    const buscapeData = await this.buscapeService.getData(params);

    const meliData = await this.meliService.getData(params);

    const products = [...buscapeData, ...meliData].sort((a, b) =>
      a.title.localeCompare(b.title),
    );

    const promises = products.map((product) =>
      this.prismaService.product.create({ data: product }),
    );

    const insertedProducts = await Promise.all(promises);

    return insertedProducts;
  }
}
