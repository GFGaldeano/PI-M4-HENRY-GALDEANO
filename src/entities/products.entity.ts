import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
  } from 'typeorm';
  import { Category } from './categories.entity';
  import { OrderDetail } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';
  
  @Entity('products')
  export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 50, nullable: false })
        @ApiProperty({
          description: 'El nombre del producto debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
          example: 'HP Pavilion 15',
        })
    name: string;
  
    @Column({ type: 'text', nullable: false })
    @ApiProperty({
      description: 'La descripción del producto debe ser certera y concisa',
      example: 'Es una supercomputadora. La madre de todas las notebooks.',
    })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    @ApiProperty({
      description: 'El precio del producto debe ser un número decimal',
      example: '600.00',
    })
    price: number;
  
    @Column({ type: 'int', nullable: false })
    @ApiProperty({
      description: 'El stock del producto debe ser un número entero',
      example: 15,
    })
    stock: number;
  
    @Column({
      type: 'text',
      default:
        'https://example.com/default-image.png',
    })
    @ApiProperty({
      description: 'La imagen del producto debe ser una URL válida',
      example: 15,
    })
    imgUrl: string;
  


    @ManyToOne(() => Category, (category) => category.products, { nullable: true })
   @JoinColumn({ name: 'categoryid' }) 
    category: Category | null;


  
    @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
 
    orderDetails: OrderDetail[];
  }
  