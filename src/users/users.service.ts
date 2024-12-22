import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(page: number, limit: number): Promise<User[]> {
    try {
      return await this.usersRepository.getUsers(page, limit);
    } catch (error) {

      throw new Error('Error al obtener la lista de usuarios.');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.getUserById(id);
      if (!user) {
        throw new NotFoundException(`No se encontró un usuario con el ID ${id}.`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al obtener los detalles del usuario.');
    }
  }


  async createUser(user: Partial<User>): Promise<Omit<User, 'password'>> {
    try {
      if (user.password) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
  
      const createdUser = await this.usersRepository.createUser(user);
  
    
      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Error al crear el usuario. Verifique los datos e intente nuevamente.');
    }
  }
  

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.usersRepository.getUserById(id);
      if (!user) {
        throw new NotFoundException(`No se encontró un usuario con el ID ${id}.`);
      }

      Object.assign(user, userData);
      return await this.usersRepository.createUser(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al actualizar el usuario. Verifique los datos e intente nuevamente.');
    }
  }

  async promoteToAdmin(id: string): Promise<User> {
    try {
      
      const user = await this.usersRepository.getUserById(id);
  
      if (!user) {
        throw new NotFoundException(`No se encontró un usuario con el ID ${id}.`);
      }
  
      
      user.isAdmin = true;
  

      return await this.usersRepository.createUser(user); 
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al promover al usuario a administrador. Verifique los datos e intente nuevamente.');
    }
  }
  

  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.usersRepository.deleteUser(id);
  
      if (result === false) {
        
        throw new BadRequestException(
          `El usuario con ID ${id} no puede ser eliminado porque tiene órdenes de compra asociadas.`,
        );
      }
  
      if (!result) {
       
        throw new NotFoundException(`No se encontró un usuario con el ID ${id}.`);
      }
    } catch (error) {
    
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
  
      throw new InternalServerErrorException(
        `Error inesperado al eliminar el usuario con ID ${id}. ${(error as Error).message || ''}`,
      );
    }
  }
  
  
}
