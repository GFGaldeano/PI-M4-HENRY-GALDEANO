import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  import { User } from './users.entity';
  import { OrderDetail } from './orderDetails.entity';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

   @Column({ type: 'enum', enum: ['accepted', 'cancelled'], default: 'accepted' })
   status: 'accepted' | 'cancelled'
  
    @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, { cascade: true })
  
    orderDetail: OrderDetail;
  
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;
    
  }
  