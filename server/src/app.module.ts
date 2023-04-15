import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search/search.controller';
import { BuscapeService } from './services/buscape/buscape.service';
import { MeliService } from './services/meli/meli.service';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [SearchController],
  providers: [BuscapeService, MeliService, PrismaService],
})
export class AppModule {}
