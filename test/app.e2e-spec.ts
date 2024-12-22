import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard } from '../src/auth/guards/auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true }) // Mock del AuthGuard
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true }) // Mock del RolesGuard
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  it('/users (GET) Debe devolver todos los usuarios', async () => {
    const req = await request(app.getHttpServer()).get('/users');

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('/users/:id (GET) Debe devolver un usuario por id', async () => {
    const userId = 'b65cec46-88ed-42da-97f0-9a82e4375907'; 
    const req = await request(app.getHttpServer()).get(`/users/${userId}`);
  
    expect(req.status).toBe(200);
    expect(req.body).toHaveProperty('id', userId);
    expect(req.body).toHaveProperty('name'); 
  });
  
  it('/users/:id (PUT) Debe actualizar un usuario por id', async () => {
    const userId = 'b65cec46-88ed-42da-97f0-9a82e4375907'; 
    const updatedUserData = {
      name: 'Updated Name',
      email: 'updatedemail@example.com',
    };
  
    const req = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updatedUserData);
  
    expect(req.status).toBe(200);
    expect(req.body).toHaveProperty('id', userId);
    expect(req.body).toMatchObject(updatedUserData); 
  });


  
  it('/products (GET) Debe volver todos los productos', async () => {
    const req = await request(app.getHttpServer()).get('/products');
  
    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array); 
  });
  
  it('/products/:id (GET) Debe devolver un producto por id', async () => {
    const productId = '58fa7fcd-92d9-41b1-b3ab-e51cc5181193'; 
    const req = await request(app.getHttpServer()).get(`/products/${productId}`);
  
    expect(req.status).toBe(200);
    expect(req.body).toHaveProperty('id', productId); 
    expect(req.body).toHaveProperty('name'); 
  });
  
  it('/products/:id (PUT) Debe actualizar un producto', async () => {
    const productId = '58fa7fcd-92d9-41b1-b3ab-e51cc5181193'; 
    const updatedProductData = {
      name: 'Updated Product Name',
      price: 100,
    };
  
    const req = await request(app.getHttpServer())
      .put(`/products/${productId}`)
      .send(updatedProductData);
  
    expect(req.status).toBe(200);
    expect(req.body).toHaveProperty('id', productId); 
    expect(req.body).toMatchObject(updatedProductData); 
  });

  it('/products/:id (DELETE) Debe eliminar un producto y devolver un mensaje de éxito', async () => {
    const productId = '58fa7fcd-92d9-41b1-b3ab-e51cc5181193'; 
  
    const req = await request(app.getHttpServer()).delete(`/products/${productId}`);
  
    expect(req.status).toBe(200); 
    expect(req.body).toEqual({
      success: true,
      message: `El producto con id: ${productId} fue eliminado correctamente`,
    }); 
  });
  

    
});
