import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  @ApiProperty({
    description: 'El nombre de la categoría debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
    example: "Laptops",
  })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products: Product[];
}
