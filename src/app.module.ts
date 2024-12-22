import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeOrmConfig  from './config/typeorm';
import { OrdersModule } from './orders/orders.module';
import { SeederService } from './seeder/seeder.service';
import { Category } from './entities/categories.entity';
import { Product } from './entities/products.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        load: [typeOrmConfig],
      }
    ),
    TypeOrmModule.forRootAsync({
     inject:[ConfigService],
     useFactory: (configService: ConfigService) => configService.get('typeorm'),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1h'},
    })
    ,
    UsersModule, ProductsModule, AuthModule, CategoriesModule, OrdersModule,
    TypeOrmModule.forFeature([Category, Product]),
    FileUploadModule],
    controllers: [],
    providers: [SeederService],//crea las categorias y productos de forma automatica
   //providers: [],// para no crear las categorias y productos de forma automatica
})
export class AppModule {}
