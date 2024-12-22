import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from '../entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async addOrder(userId: string, productIds: string[]): Promise<Order> {
    try {
      const order = await this.ordersRepository.addOrder(userId, productIds);
     
      if (order.user) {
        delete order.user.password;
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al agregar el pedido. ${errorMessage}`);
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      return await this.ordersRepository.getOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al obtener las órdenes. ${errorMessage}`);
    }
  }


  async getOrder(orderId: string): Promise<Order> {
    try {
      const order = await this.ordersRepository.getOrder(orderId);
      if (!order) {
        throw new NotFoundException(`No se encontró un pedido con el ID ${orderId}.`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al obtener el pedido.');
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const orderWithRelations = (await this.ordersRepository.createQueryBuilder('order'))
        .leftJoinAndSelect('order.orderDetail', 'orderDetail')
        .leftJoinAndSelect('orderDetail.products', 'products')
        .where('order.id = :id', { id: orderId })
        .getOne();
  
      const order = await orderWithRelations;
  
      if (!order) {
        throw new NotFoundException(`No se encontró la orden con ID ${orderId}.`);
      }
  
      if (order.status === 'cancelled') {
        throw new BadRequestException(`La orden con ID ${orderId} ya está cancelada.`);
      }
  
      order.status = 'cancelled';
  
      for (const product of order.orderDetail.products) {
        product.stock += 1;
        await this.ordersRepository.incrementProductStock(product.id, 1);
      }
  
      await this.ordersRepository.save(order);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al cancelar la orden. ${errorMessage}`);
    }
  }
  

  
}