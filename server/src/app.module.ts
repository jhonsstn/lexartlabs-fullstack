import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category/category.controller';
import { SearchController } from './controllers/search/search.controller';
import { StoreController } from './controllers/store/store.controller';
import { BuscapeService } from './services/buscape/buscape.service';
import { CategoryService } from './services/category/category.service';
import { MercadoLivreService } from './services/mercadoLivre/mercadoLivre.service';
import { PrismaService } from './services/prisma/prisma.service';
import { ProductService } from './services/product/product.service';
import { StoreService } from './services/store/store.service';
import { TermService } from './services/term/term.service';

@Module({
  imports: [HttpModule],
  controllers: [SearchController, CategoryController, StoreController],
  providers: [
    BuscapeService,
    MercadoLivreService,
    PrismaService,
    CategoryService,
    StoreService,
    ProductService,
    TermService,
  ],
})
export class AppModule {}
