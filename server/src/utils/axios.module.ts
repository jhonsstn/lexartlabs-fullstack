import { Module } from '@nestjs/common';
import axios from 'axios';

@Module({
  providers: [
    {
      provide: 'AxiosInstance',
      useValue: axios,
    },
  ],
  exports: ['AxiosInstance'],
})
export class AxiosModule {}
