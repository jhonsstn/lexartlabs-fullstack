import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  mercadoLivreCategory: string;

  @ApiProperty()
  buscapeCategory: string;
}
