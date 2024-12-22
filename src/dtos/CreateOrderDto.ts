import { IsNotEmpty, IsUUID, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
