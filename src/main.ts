import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal, LoggerMiddleware} from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Configurar el Global Pipe
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true, // Convierte los datos automáticamente al tipo esperado
        whitelist: true, // Ignora propiedades que no estén definidas en el DTO
        forbidNonWhitelisted: true, // Lanza un error si se reciben propiedades no definidas
      }),
    );

  app.use(loggerGlobal);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-COMMERCE - PROYECTO INTEGRADOR MÓDULO 4 - BACKEND- FULL STACK DEVELOPER - GUSTAVO GALDEANO')
    .setDescription('Esta es una API construida con NestJS para ser empleada en el proyecto integrador del módulo 4 de la especialidad Backend de la carrera Full Stack Developer de Henry')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {customSiteTitle: 'PM4 - GUSTAVO GALDEANO'});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
