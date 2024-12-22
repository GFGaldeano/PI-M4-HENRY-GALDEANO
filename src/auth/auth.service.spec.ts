import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';



jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn(), 
  hash: jest.fn(), 
}));


describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('Debe crear un nuevo usuario', async () => {
      const user = {
        email: 'test@test.com',
        password: '123456',
        name: 'Test',
        phone: 1234567890,
        country: 'Testland',
        address: '123 Test St',
        city: 'Test City',
      };
      const hashedPassword = await bcrypt.hash(user.password, 10);
    
      
      const savedUser = {
        id: 'uuid-123',
        email: user.email,
        password: hashedPassword,
        name: user.name,
        phone: user.phone,
        country: user.country,
        address: user.address,
        city: user.city,
        isAdmin: false, 
        orders: [], 
      };
    
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null); 
      jest.spyOn(usersRepository, 'save').mockResolvedValue(savedUser as User); 
    
      const result = await authService.signup(user);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: user.email });
      expect(usersRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'uuid-123',
        email: user.email,
        name: user.name,
        phone: user.phone,
        country: user.country,
        address: user.address,
        city: user.city,
        isAdmin: false,
      }); 
    });
    

    it('Debe dar error si el usuario ya existe', async () => {
      const user = { email: 'test@test.com', password: '123456' };

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user as User); 

      await expect(authService.signup(user)).rejects.toThrow(BadRequestException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: user.email });
    });
  });

  describe('signin', () => {
    it('Debe iniciar sesión exitosamente un usuario', async () => {
      const user = {
        id: 'uuid-123',
        email: 'test@test.com',
        password: await bcrypt.hash('123456', 10),
        isAdmin: false,
      };
      const token = 'mocked-jwt-token';
    
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); 
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    
      const result = await authService.signin(user.email, '123456');
    
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: user.email });
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });
      expect(result).toEqual({ mensaje: 'Logged in', token });
    });
    

    it('Debe lanzar NotFoundException si el usuario no existe', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null); 

      await expect(authService.signin('test@test.com', '123456')).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
    });

    it('Debería lanzar NotFoundException si la contraseña es inválida', async () => {
      const user = {
        id: 'uuid-123',
        email: 'test@test.com',
        password: await bcrypt.hash('123456', 10),
      };
    
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); 
    
      await expect(authService.signin('test@test.com', 'wrongpassword')).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
    });
    
  });
});
