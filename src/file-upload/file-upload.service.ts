import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';

import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: string): Promise<string> {

    const product = await this.productsRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

 
    const uploadResult = await this.fileUploadRepository.uploadImage(file);

    
    product.imgUrl = uploadResult.secure_url; 
    await this.productsRepository.save(product);


    return uploadResult.secure_url;
  }
}

