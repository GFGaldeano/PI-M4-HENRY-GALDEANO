import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'El email debe ser un email válido',
    example: 'gustavo_gustavo@yahoo.com.ar',
  })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*). Longitud: entre 8 y 15 caracteres',
  })
  @ApiProperty({
    description: 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*). Longitud: entre 8 y 15 caracteres',
    example: '25543241Gfg#',
  })
  password: string;
}
