import { Injectable, NotFoundException,HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categories.entity';

import data from '../datajson/data.json';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoriesRepository.find();
    } catch (error) {
      throw new Error('Error al obtener la lista de categorías.');
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoriesRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`No se encontró una categoría con el ID ${id}.`);
      }
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al buscar la categoría.');
    }
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    try {
      const newCategory = this.categoriesRepository.create(data);
      return await this.categoriesRepository.save(newCategory);
    } catch (error) {
      throw new Error('Error al crear la categoría. Verifique los datos e intente nuevamente.');
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    try {
      const category = await this.getCategoryById(id);
      Object.assign(category, data);
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al actualizar la categoría. Verifique los datos e intente nuevamente.');
    }
  }



  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    if (category.products && category.products.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría con ID ${id} porque tiene productos asociados.`
      );
    }

    await this.categoriesRepository.remove(category);
  }

  


  async addCategories(): Promise<string> {
    try {
      await Promise.all(
        data.map(async (product) => {
          await this.categoriesRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values({ name: product.category })
            .orIgnore()
            .execute();
        }),
      );
      return 'Categorías agregadas exitosamente.';
    } catch (error) {
      throw new Error('Error al agregar categorías desde el archivo JSON.');
    }
  }
}
