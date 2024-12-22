import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  @ApiProperty({
    description:
      'El nombre del usuario debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
    example: 'Gustavo Galdeano',
  })
  name: string;

  @Column({ length: 50, unique: true, nullable: false })
  @ApiProperty({
    description: 'El email debe ser un email válido',
    example: 'gustavo_example@yahoo.com.ar',
  })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({
    description:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*). Longitud: entre 8 y 15 caracteres',
    example: 'StronG!Passw0rd',
  })
  password: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({
    description: 'El teléfono debe ser un número entero no mayor de 8 dígitos',
    example: 12345678,
  })
  phone: number;

  @Column({ length: 50, nullable: true })
  @ApiProperty({
    description:
      'El País debe tener como mínimo 5 caracteres y un máximo de 20 caracteres',
    example: 'Bolivia',
  })
  country: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description:
      'La dirección debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
    example: 'Cochabamba 666',
  })
  address: string;

  @Column({ length: 50, nullable: true })
  @ApiProperty({
    description:
      'La ciudad debe tener como mínimo 5 caracteres y un máximo de 20 caracteres',
    example: 'La Paz',
  })
  city: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description:
      'Asignada por default al crear el usuario, no debe ser incluida en el body',
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  @JoinColumn({ name: 'order_id' })
  orders: Order[];
}
