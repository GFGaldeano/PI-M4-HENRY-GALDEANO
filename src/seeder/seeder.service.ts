import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categories.entity';
import { Product } from '../entities/products.entity';
import data from '../../src/datajson/data.json';


@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Seeding database...');
    await this.seedDatabase();
  }

  private async seedDatabase(): Promise<void> {
 
    const categories = [...new Set(data.map((item) => item.category))];

 
    for (const categoryName of categories) {
      if (typeof categoryName !== 'string') {
        console.error(`Invalid category type: ${typeof categoryName}`);
        continue;
      }

      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: categoryName },
      });

      if (!existingCategory) {
        const newCategory = this.categoriesRepository.create({ name: categoryName });
        await this.categoriesRepository.save(newCategory);
      }
    }

  
    for (const productData of data) {
      const { name, description, price, stock, category } = productData;

      const existingProduct = await this.productsRepository.findOne({
        where: { name },
      });

      if (!existingProduct) {
        const existingCategory = await this.categoriesRepository.findOne({
          where: { name: category },
        });

        if (!existingCategory) {
          console.error(
            `Category ${category} not found for product ${name}. Ensure categories are loaded first.`,
          );
          continue;
        }

        const newProduct = this.productsRepository.create({
          name,
          description,
          price,
          stock,
          category: existingCategory,
        });

        await this.productsRepository.save(newProduct);
      }
    }

    console.log('Database seeding completed.');
  }
}
