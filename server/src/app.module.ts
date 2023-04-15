import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BuscapeController } from './controllers/buscape/buscape.controller';
import { BuscapeService } from './services/buscape/buscape.service';
import { MeliService } from './services/meli/meli.service';

@Module({
  imports: [HttpModule],
  controllers: [BuscapeController],
  providers: [BuscapeService, MeliService],
})
export class AppModule {}
