import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/products.entity';

export class GetCategoryByIdDto {
  @ApiProperty({
    description: 'El identificador único de la categoría',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'El nombre de la categoría',
    example: 'Laptops',
  })
  name: string;

  @ApiProperty({
    description: 'Listado de productos asociados a la categoría',
    type: [Product],
    example: [
      {
        id: '1',
        name: 'HP Pavilion',
        description: 'Laptop de alto rendimiento',
        price: 600.0,
        stock: 10,
        imgUrl: 'https://example.com/product.png',
      },
    ],
  })
  products: Product[];
}
