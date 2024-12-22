
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Order } from '../entities/orders.entity';
import { User } from '../entities/users.entity';
import { Product } from '../entities/products.entity';
import { OrderDetail } from '../entities/orderDetails.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    
  ) {}


  async addOrder(userId: string, productIds: string[]): Promise<Order> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
        stock: MoreThan(0),
      },
    });

    const validProductIds = new Set(products.map((product) => product.id));
    const invalidProducts = productIds.filter((id) => !validProductIds.has(id));

    if (invalidProducts.length > 0) {
      throw new BadRequestException(
        `Los siguientes productos no tienen stock o son inválidos: ${invalidProducts.join(', ')}`,
      );
    }

    for (const product of products) {
      product.stock -= 1;
      await this.productRepository.save(product);
    }

    const total = products.reduce((sum, product) => sum + Number(product.price), 0);

    const orderDetail = this.orderDetailRepository.create({
      price: total,
      products,
    });
    await this.orderDetailRepository.save(orderDetail);

    const order = this.orderRepository.create({
      user,
      orderDetail,
    });
    return await this.orderRepository.save(order);
  }

  async getOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'orderDetail', 'orderDetail.products'],
    });
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderDetail', 'orderDetail.products'], 
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }


  async incrementProductStock(productId: string, incrementBy: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (product) {
      product.stock += incrementBy;
      await this.productRepository.save(product);
    }
  }

  async save(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }

  async createQueryBuilder(alias: string) {
    return this.orderRepository.createQueryBuilder(alias);
  }
}
