import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/users.entity';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from '../roles.enum';
import { Roles } from '../decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ShowUserWithOutPassDto } from '../dtos/ShowUserWithOutPassDto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<ShowUserWithOutPassDto[]> {
    try {
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        throw new Error('Los parámetros "page" y "limit" deben ser números.');
      }

      const users = await this.usersService.getUsers(pageNumber, limitNumber);

      return users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        'Error al obtener la lista de usuarios. Por favor, inténtelo más tarde.',
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ShowUserWithOutPassDto | null> {
    try {
      const user = await this.usersService.getUserById(id);

      if (!user) {
        return null;
      }

      const { password, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        phone: userWithoutPassword.phone,
      };
    } catch (error) {
      throw new Error(
        `Error al buscar el usuario con ID ${id}. ${(error as any).message}`,
      );
    }
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new Error(
        'Error al crear el usuario. Verifique los datos e intente nuevamente.',
      );
    }
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ShowUserWithOutPassDto> {
    try {
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);

      if (!updatedUser) {
        throw new Error(`No se encontró el usuario con ID ${id}.`);
      }

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        ...userWithoutPassword,
        phone: userWithoutPassword.phone,
      };
    } catch (error) {
      throw new Error(
        `Error al actualizar el usuario con ID ${id}. ${(error as any).message}`,
      );
    }
  }

  @ApiBearerAuth()
  @Put('promote/:id')
  //@Roles(Role.Admin)
  //@UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  async promoteToAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: any,
  ): Promise<ShowUserWithOutPassDto> {
    try {
      const updatedUser = await this.usersService.promoteToAdmin(id);

      if (!updatedUser) {
        throw new Error(`No se encontró el usuario con ID ${id}.`);
      }

      const { password, ...userWithoutPassword } = updatedUser;

      return {
        ...userWithoutPassword,
        phone: userWithoutPassword.phone,
      };
    } catch (error) {
      throw new Error(
        `Error al promover el usuario con ID ${id}. ${(error as any).message}`,
      );
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.usersService.deleteUser(id);
      return {
        success: true,
        message: `El usuario con id: ${id} fue eliminado correctamente`,
      };
    } catch (error) {
      
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        `Error inesperado al eliminar el usuario con ID ${id}. ${(error as Error).message || ''}`,
      );
    }
  }
}
