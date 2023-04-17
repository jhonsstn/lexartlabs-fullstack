import { ApiProperty } from '@nestjs/swagger';

export class StoreDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  store: string;
}
