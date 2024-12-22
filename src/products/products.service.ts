import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { Category } from '../entities/categories.entity';
import data from '../datajson/data.json';
import { CreateProductDto } from '../dtos/CreateProductDto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    
  ) {}


  async getProducts(page: number, limit: number): Promise<Product[]> {
    try {
    
      const pageNumber = Math.max(page, 1);
      const limitNumber = Math.max(limit, 1);

      const skip = (pageNumber - 1) * limitNumber;

      console.log(`Obteniendo productos: Skip = ${skip}, Take = ${limitNumber}`);

 
      const products = await this.productsRepository.find({
        relations: ['category'], 
        skip,
        take: limitNumber,
      });

      return products;
    } catch (error) {
      const err = error as Error;
      console.error('Error en el servicio al obtener productos:', err.message);
      throw new Error('Error al obtener la lista de productos desde la base de datos.');
    }
  }



  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({ where: { id }, relations: ['category'] });
      if (!product) {
        throw new NotFoundException(`No se encontró un producto con el ID ${id}.`);
      }
      return product;
    } catch (error) {
   
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al obtener el producto.');
    }
  }
  

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      const category = await this.categoriesRepository.findOne({ where: { id: data.categoryId} });
      if (!category) {
        throw new NotFoundException(`No se encontró una categoría con el ID ${data.categoryId}.`);
      }

      const newProduct = this.productsRepository.create({ ...data, category });
      return await this.productsRepository.save(newProduct);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al crear el producto. Verifique los datos e intente nuevamente.');
    }
  }


  async updateProduct(id: string, data: Partial<CreateProductDto>): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(`No se encontró un producto con el ID ${id}.`);
      }

      if (data.categoryId) {
        const category = await this.categoriesRepository.findOne({ where: { id: data.categoryId } });
        if (!category) {
          throw new NotFoundException(`No se encontró una categoría con el ID ${data.categoryId}.`);
        }
        product.category = category;
      }

      Object.assign(product, data);
      return await this.productsRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new BadRequestException(`Error al actualizar el producto con ID ${id}. ${errorMessage}`);
    }
  }



  async deleteProduct(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`No se encontró un producto con el ID ${id}.`);
    }

    try {
      await this.productsRepository.remove(product);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(`Error al eliminar el producto. ${errorMessage}`);
    }
  }
  
  

  async addProducts(): Promise<string> {
    try {
      await Promise.all(
        data.map(async (productData) => {
          const existingProduct = await this.productsRepository.findOne({
            where: { name: productData.name },
          });

          if (!existingProduct) {
            const category = await this.categoriesRepository.findOne({
              where: { name: productData.category },
            });

            if (!category) {
              throw new BadRequestException(
                `No se encontró la categoría '${productData.category}' para el producto '${productData.name}'.`,
              );
            }

            await this.productsRepository
              .createQueryBuilder()
              .insert()
              .into(Product)
              .values({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                stock: productData.stock,
                category,
              })
              .orIgnore()
              .execute();
          }
        }),
      );

      return 'Productos agregados exitosamente.';
    } catch (error) {
      throw new Error('Error al agregar los productos desde el archivo JSON.');
    }
  }


}
