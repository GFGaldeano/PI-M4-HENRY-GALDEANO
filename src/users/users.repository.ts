import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { validate as isUuid } from 'uuid'; 

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}



  async getUsers(page: number, limit: number): Promise<User[]> {
    
    if (page < 1 || limit < 1) {
      throw new Error('Los valores de "page" y "limit" deben ser mayores o iguales a 1.');
    }
  
    const offset = (page - 1) * limit;
  
   
    return await this.userRepository.find({
      skip: offset,
      take: limit,
    });
  }
  

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }


  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    Object.assign(existingUser, user);
    return await this.userRepository.save(existingUser);
  }


  async deleteUser(id: string): Promise<boolean> {
    try {
    
      const userWithOrders = await this.userRepository.findOne({
        where: { id },
        relations: ['orders'], 
      });
  
      if (userWithOrders?.orders?.length > 0) {
        
        return false;
      }
  

      const result = await this.userRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error en la base de datos al intentar eliminar el usuario con ID ${id}.`,
      );
    }
  }
  
  
}
