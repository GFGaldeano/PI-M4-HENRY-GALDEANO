import {
    IsString,
    IsEmail,
    Matches,
    Length,
    IsNotEmpty,
    IsOptional,
    IsInt,
    MinLength,
    MaxLength,
    Validate,
  } from 'class-validator';
import { MatchPassword } from '../utils/matchPassword';
import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 80)
    @ApiProperty({
      description: 'El nombre del usuario debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
      example: 'Gustavo Galdeano',
    })
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
      description: 'El email debe ser un email válido',
      example: 'gustavo_galdeano@yahoo.com.ar',
    })
    email: string;
  
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*). Longitud: entre 8 y 15 caracteres',
    })
    @MinLength(8)
    @MaxLength(15)
    @ApiProperty({
      description: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*). Longitud: entre 8 y 15 caracteres',
      example: '25543241Gfg#',
    })
    password: string;

    @IsNotEmpty()
    @Validate(MatchPassword, ['password'])
    @ApiProperty({
      description: 'La confirmación de la contraseña debe ser igual a la contraseña',
      example: '25543241Gfg#',
    })
    confirmpassword: string;
  
    @IsString()
    @Length(3, 80)
    @ApiProperty({
      description: 'La dirección debe tener como mínimo 3 caracteres y un máximo de 80 caracteres',
      example: 'Colón 641',
    })
    address: string;
  
    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
      description: 'El teléfono debe ser un número entero no mayor de 8 dígitos',
      example: 12345678,
    })
    phone: number;
  
    @IsString()
    @Length(5, 20)
    @ApiProperty({
      description: 'El País debe tener como mínimo 5 caracteres y un máximo de 20 caracteres',
      example: 'Argentina',
    })
    country: string;
  
    @IsString()
    @Length(5, 20)
    @ApiProperty({
      description: 'La ciudad debe tener como mínimo 5 caracteres y un máximo de 20 caracteres',
      example: 'Monteros',
    })
    city: string;
    
  }
  