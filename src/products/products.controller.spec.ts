import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/products.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProductDto } from '../dtos/CreateProductDto';
import { Category } from '../entities/categories.entity';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    addProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('Debe devolver un arreglo de productos', async () => {
      const products: Product[] = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 10,
          stock: 100,
          imgUrl: 'https://example.com/product.png',
          category: null,
          orderDetails: [],
        },
      ];
      mockProductsService.getProducts.mockResolvedValue(products);

      const result = await productsController.getProducts('1', '10');
      expect(result).toEqual(products);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getProductById', () => {
    it('Debe devolver un único producto por ID', async () => {
      const product: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 10,
        stock: 100,
        imgUrl: 'https://example.com/product.png',
        category: null,
        orderDetails: [],
      };
      mockProductsService.getProductById.mockResolvedValue(product);

      const result = await productsController.getProductById('1');
      expect(result).toEqual(product);
      expect(mockProductsService.getProductById).toHaveBeenCalledWith('1');
    });

    it('Debe lanzar un error si el producto no es encontrado', async () => {
      mockProductsService.getProductById.mockRejectedValue(new Error('Product not found'));

      await expect(productsController.getProductById('invalid-id')).rejects.toThrow(
        'Error inesperado al buscar el producto con ID invalid-id.',
      );
    });
  });

  describe('createProduct', () => {
    it('Debe crear y devolver un nuevo producto', async () => {
      const newProduct: CreateProductDto = {
        name: 'New Product',
        description: 'New Product Description',
        price: 20,
        stock: 50,
        imgUrl: 'https://example.com/new-product.png',
        categoryId: 'test-category-id',
      };
      const createdProduct: Product = {
        id: '1',
        ...newProduct,
        category: null,
        orderDetails: [],
      };
      mockProductsService.createProduct.mockResolvedValue(createdProduct);

      const result = await productsController.createProduct(newProduct);
      expect(result).toEqual(createdProduct);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(newProduct);
    });
  });

  describe('updateProduct', () => {
    it('Debe actualizar y devolver el producto actualizado', async () => {
      const updatedData: Partial<CreateProductDto> = { price: 15 };
      const updatedProduct: Product = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 15,
        stock: 100,
        imgUrl: 'https://example.com/product.png',
        category: null,
        orderDetails: [],
      };
      mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

      const result = await productsController.updateProduct('1', updatedData);
      expect(result).toEqual(updatedProduct);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith('1', updatedData);
    });
  });

  describe('deleteProduct', () => {
    it('Debe eliminar un producto por ID', async () => {
      mockProductsService.deleteProduct.mockResolvedValue(undefined);

      const result = await productsController.deleteProduct('1');
      expect(result).toEqual({
        success: true,
        message: 'El producto con id: 1 fue eliminado correctamente',
      });
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith('1');
    });
  });

  describe('seedProducts', () => {
    it('Debe cargar productos y devolver un mensaje de éxito', async () => {
      const message = 'Seed successful';
      mockProductsService.addProducts.mockResolvedValue(message);

      const result = await productsController.seedProducts();
      expect(result).toEqual(message);
      expect(mockProductsService.addProducts).toHaveBeenCalled();
    });
  });
});
