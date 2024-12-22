import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/products.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/CreateProductDto';
import { UpdateProductDto } from '../dtos/UpdateProductDto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}



  @Get()
  async getProducts(
     @Query('page') page: string = '1',
     @Query('limit') limit: string = '10',
  ): Promise<Product[]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      
      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        throw new Error('Los parámetros "page" y "limit" deben ser números.');
      }
      return await this.productsService.getProducts(pageNumber, limitNumber);
    } catch (error) {
      throw new Error('Error al obtener la lista de productos. Por favor, inténtelo más tarde.');
    }
  }




  @Get(':id')
async getProductById(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
  try {
    return await this.productsService.getProductById(id);
  } catch (error) {

    if (error instanceof NotFoundException) {
      throw error;
    }
 
    throw new InternalServerErrorException(`Error inesperado al buscar el producto con ID ${id}.`);
  }
}


  @Post()
 
   async createProduct(@Body() data: CreateProductDto): Promise<Product> {
    try {
      return await this.productsService.createProduct(data);
    } catch (error) {
      throw new Error('Error al crear el producto. Verifique los datos e intente nuevamente.');
    }
  }

 

  @ApiBody({
    description: 'Cuerpo de datos para actualizar un producto',
    schema: {
      example: {
        name: 'Laptop HP Pavilion',
        description: 'Una descripción actualizada del producto',
        price: 1500,
        stock: 20,
        categoryId: 'd51b3725-949d-41f7-9ea1-138876b4b399',
      },
    },
  })
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productsService.updateProduct(id, data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al actualizar el producto con ID ${id}. ${errorMessage}`);
    }
  }




@Delete(':id')
async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: boolean; message: string }> {
  try {
    await this.productsService.deleteProduct(id);
    return {
      success: true,
      message: `El producto con id: ${id} fue eliminado correctamente`,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new BadRequestException(`No se encontró un producto con el ID ${id}.`);
    }
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new BadRequestException(`Error al eliminar el producto con ID ${id}. ${errorMessage}`);
  }
}


  @Post('seeder')
  async seedProducts(): Promise<string> {
    try {
      return await this.productsService.addProducts();
    } catch (error) {
      throw new Error('Error al ejecutar el seeder de productos.');
    }
  }
 

}

