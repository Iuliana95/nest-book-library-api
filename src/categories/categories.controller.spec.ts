import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(() => [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ]),
    find: jest.fn((id) => ({ id, name: `Category ${id}` })),
    create: jest.fn((dto) => ({ id: 1, ...dto })), // Simulează un ID generat
    update: jest.fn((id, dto) => ({ id, ...dto })),
    delete: jest.fn((id) => ({ deleted: true, id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockCategoriesService }]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return categories', async () => {
    const mockCategories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    (service.findAll as jest.Mock).mockResolvedValue(mockCategories);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it('should call find with the correct id and return category', async () => {
    const id = 1;
    const mockCategory = { id: 1, name: 'Category 1' };
    (service.find as jest.Mock).mockResolvedValue(mockCategory);

    const result = await controller.find(id);
    expect(service.find).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockCategory);
  });

  it('should call create with the correct dto and return created category', async () => {
    const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
    const mockCategory = { id: 1, name: 'Test Category' };
    (service.create as jest.Mock).mockResolvedValue(mockCategory);

    const result = await controller.create(createCategoryDto);
    expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    expect(result).toEqual(mockCategory);
  });

  it('should call update with the correct id and dto and return updated category', async () => {
    const id = 1;
    const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
    const mockCategory = { id: 1, name: 'Updated Category' };
    (service.update as jest.Mock).mockResolvedValue(mockCategory);

    const result = await controller.update(id, updateCategoryDto);
    expect(service.update).toHaveBeenCalledWith(id, updateCategoryDto);
    expect(result).toEqual(mockCategory);
  });

  it('should call delete with the correct id and return void', async () => {
    const id = 1;
    (service.delete as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.delete(id);
    expect(service.delete).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });
});
