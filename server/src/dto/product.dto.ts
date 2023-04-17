import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  description: string[];

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  storeId: string;
}
