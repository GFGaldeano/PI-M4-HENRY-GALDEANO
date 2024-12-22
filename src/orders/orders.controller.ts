import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../entities/orders.entity';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const productIds = createOrderDto.products.map((product) => product.id);
      const order = await this.ordersService.addOrder(
        createOrderDto.userId,
        productIds,
      );
      // Excluir la contraseña antes de devolver el usuario
      if (order.user) {
        delete order.user.password;
      }
      return order;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al agregar el pedido. ${errorMessage}`,
      );
    }
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  async getOrders(): Promise<Order[]> {
    try {
      const orders = await this.ordersService.getOrders();

      orders.forEach((order) => {
        if (order.user) {
          delete order.user.password;
        }
      });
      return orders;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al obtener las órdenes. ${errorMessage}`,
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) orderId: string): Promise<Order> {
    try {
      return await this.ordersService.getOrder(orderId);
    } catch (error) {
      throw new Error(
        `Error al obtener el pedido con ID ${orderId}. ${(error as any).message}`,
      );
    }
  }

  @ApiBearerAuth()
  @Put('cancel/:id')
  @UseGuards(AuthGuard)
  async cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.ordersService.cancelOrder(id);
      return {
        success: true,
        message: `La orden con ID ${id} ha sido cancelada correctamente.`,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(
        `Error al cancelar la orden. ${errorMessage}`,
      );
    }
  }
}
