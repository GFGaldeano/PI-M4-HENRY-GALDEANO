import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/products.entity';
import { Category } from '../entities/categories.entity';
import { CloudinaryConfig } from '../config/cloudinary';


@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService,CloudinaryConfig],
  exports: [ProductsService,CloudinaryConfig],
})
export class ProductsModule {}
