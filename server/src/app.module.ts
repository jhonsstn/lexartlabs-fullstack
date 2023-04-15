import { Module } from '@nestjs/common';
// import axios from 'axios';
import { BuscapeController } from './buscape/buscape.controller';
import { BuscapeService } from './buscape/buscape.service';
// import { AxiosModule } from './utils/axios.module';
// import { JsdomModule } from './utils/jsdom.module';

@Module({
  imports: [],
  controllers: [BuscapeController],
  providers: [BuscapeService],
})
export class AppModule {}
