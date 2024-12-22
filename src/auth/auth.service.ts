import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>,
  private jwtService: JwtService ) {}



async signup(user: Partial<User>) {
  const userExist = await this.usersRepository.findOneBy({ email: user.email });
  if (userExist) {
    throw new BadRequestException('Usuario ya registrado');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = { ...user, password: hashedPassword };
  const saveUser = await this.usersRepository.save(newUser);
  const { password, orders, ...userWithoutSensitiveData } = saveUser; 
  return userWithoutSensitiveData;
}


  async signin(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = this.jwtService.sign(payload);
    return { mensaje: 'Logged in', token };
  }
}
