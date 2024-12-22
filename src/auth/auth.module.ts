import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/users.entity';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, AuthRepository],     
  controllers: [AuthController],
})
export class AuthModule {}
