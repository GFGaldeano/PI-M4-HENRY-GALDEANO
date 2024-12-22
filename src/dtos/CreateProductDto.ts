import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsUrl, IsInt, Length } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'El nombre del producto debe tener entre 3 y 50 caracteres.',
    example: 'HP Pavilion 15',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description: 'La descripción del producto debe ser certera y concisa.',
    example: 'Es una supercomputadora. La madre de todas las notebooks.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'El precio del producto debe ser un número decimal.',
    example: 600.0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'El stock del producto debe ser un número entero.',
    example: 15,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'La imagen del producto debe ser una URL válida.',
    example: 'https://example.com/default-image.png',
  })
  @IsString()
  @IsUrl()
  imgUrl: string;

  @ApiProperty({
    description: 'El ID de la categoría asociada al producto.',
    example: 'uuid-category-id',
  })
  @IsString()
  categoryId: string;
}
