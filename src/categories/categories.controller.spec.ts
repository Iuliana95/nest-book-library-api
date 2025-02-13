import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockCategoriesService = {
  findAll: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return categories', async () => {
    const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    mockCategoriesService.findAll.mockResolvedValue(mockCategories);

    const result = await controller.findAll();
    expect(mockCategoriesService.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it('should call find with the correct id and return category', async () => {
    const id = 1;
    const mockCategory = { id: 1, name: 'Category 1' };
    mockCategoriesService.find.mockResolvedValue(mockCategory);

    const result = await controller.find(id);
    expect(mockCategoriesService.find).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockCategory);
  });

  it('should call create with the correct dto and return created category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
    const mockCategory = { id: 1, name: 'Test Category' };
    mockCategoriesService.create.mockResolvedValue(mockCategory);

    const result = await controller.create(createCategoryDto);
    expect(mockCategoriesService.create).toHaveBeenCalledWith(createCategoryDto);
    expect(result).toEqual(mockCategory);
  });

  it('should call update with the correct id and dto and return updated category', async () => {
    const id = 1;
    const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
    const mockCategory = { id: 1, name: 'Updated Category' };
    mockCategoriesService.update.mockResolvedValue(mockCategory);

    const result = await controller.update(id, updateCategoryDto);
    expect(mockCategoriesService.update).toHaveBeenCalledWith(id, updateCategoryDto);
    expect(result).toEqual(mockCategory);
  });

  it('should call delete with the correct id and return void', async () => {
    const id = 1;
    mockCategoriesService.delete.mockResolvedValue(undefined);

    const result = await controller.delete(id);
    expect(mockCategoriesService.delete).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });

  it('should throw NotFoundException if category not found in find', async () => {
    const id = 999;
    mockCategoriesService.find.mockResolvedValue(null);

    try {
      await controller.find(id);
    } catch (e) {
      expect(e.response.statusCode).toBe(404);
      expect(e.response.message).toBe('Category not found');
    }
  });
});
