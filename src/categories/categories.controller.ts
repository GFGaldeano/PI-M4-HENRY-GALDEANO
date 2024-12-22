import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, BadRequestException, NotFoundException  } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from 'src/entities/categories.entity';
import { ApiTags } from '@nestjs/swagger';
import { GetCategoryByIdDto } from 'src/dtos/GetCategoryByIdDto';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  
  @Get()
  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoriesService.getCategories();
    } catch (error) {
      throw new Error('Error al obtener la lista de categorías. Por favor, inténtelo más tarde.');
    }
  }

  @Get(':id')
    async getCategoryById(@Param('id', ParseUUIDPipe) id: string): Promise<GetCategoryByIdDto | null> {
    try {
      return await this.categoriesService.getCategoryById(id);
    } catch (error) {
      throw new Error(`Error al buscar la categoría con ID ${id}. ${(error as any).message}`);
    }
  }

  @Post()
  async createCategory(@Body() data: Partial<Category>): Promise<Category> {
    try {
      return await this.categoriesService.createCategory(data);
    } catch (error) {
      throw new Error('Error al crear la categoría. Verifique los datos e intente nuevamente.');
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Partial<Category>,
  ): Promise<Category> {
    try {
      return await this.categoriesService.updateCategory(id, data);
    } catch (error) {
      throw new Error(`Error al actualizar la categoría con ID ${id}. ${(error as any).message}`);
    }
  }


  @Delete(':id')
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    try {
      await this.categoriesService.deleteCategory(id);
      return { message: `La categoría con ID ${id} fue eliminada exitosamente.` };
    } catch (error) {
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al eliminar la categoría con ID ${id}. ${errorMessage}`);
    }
  }



  @Post('seeder')
  async seedCategories(): Promise<string> {
    try {
      return await this.categoriesService.addCategories();
    } catch (error) {
      throw new Error('Error al ejecutar el seeder de categorías.');
    }
  }
}
