import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';


@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}




  async addProducts(products: Partial<Product[]>): Promise<Product[]> {
    const existingProducts = await this.productsRepository.find();
    const existingNames = existingProducts.map((prod) => prod.name);

    const newProducts = products.filter(
      (product) => !existingNames.includes(product.name),
    );

    return this.productsRepository.save(newProducts);
  }
}
