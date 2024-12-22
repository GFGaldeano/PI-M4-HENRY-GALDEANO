import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'El nombre de la categoría debe tener entre 3 y 50 caracteres.',
    example: 'Laptops',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
}
