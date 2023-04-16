import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category/category.controller';
import { SearchController } from './controllers/search/search.controller';
import { BuscapeService } from './services/buscape/buscape.service';
import { CategoryService } from './services/category/category.service';
import { MeliService } from './services/meli/meli.service';
import { PrismaService } from './services/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [SearchController, CategoryController],
  providers: [BuscapeService, MeliService, PrismaService, CategoryService],
})
export class AppModule {}
