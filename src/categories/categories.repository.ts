import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async addCategories(categories: string[]): Promise<Category[]> {
    const existingCategories = await this.categoryRepository.find();
    const existingNames = existingCategories.map((cat) => cat.name);
    const newCategories = categories
      .filter((name) => !existingNames.includes(name))
      .map((name) => ({ name }));

    return this.categoryRepository.save(newCategories);
  }
}
