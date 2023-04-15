import { Module } from '@nestjs/common';
import { JSDOM } from 'jsdom';

@Module({
  providers: [
    {
      provide: 'JSDOM',
      useValue: JSDOM,
    },
  ],
  exports: ['JSDOM'],
})
export class JsdomModule {}
