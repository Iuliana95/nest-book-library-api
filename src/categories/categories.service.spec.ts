import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {BadRequestException, NotFoundException} from "@nestjs/common";

const mockCategoryRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: mockCategoryRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should return all categories', async () => {
    const result = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
    mockCategoryRepository.find.mockResolvedValue(result);

    expect(await service.findAll()).toBe(result);
    expect(mockCategoryRepository.find).toHaveBeenCalled();
  });

  it('should return a category by id', async () => {
    const id = 1;
    const result = { id, name: 'Category 1' };
    mockCategoryRepository.findOne.mockResolvedValue(result);

    expect(await service.find(id)).toBe(result);
    expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  });

  it('should throw NotFoundException if category is not found', async () => {
    const id = 1;
    mockCategoryRepository.findOne.mockResolvedValue(null);

    try {
      await service.find(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should create a new category', async () => {
    const createCategoryDto = { name: 'New Category' };
    const result = { id: 1, name: 'New Category' };
    mockCategoryRepository.findOne.mockResolvedValue(null); // No existing category
    mockCategoryRepository.create.mockReturnValue(result);
    mockCategoryRepository.save.mockResolvedValue(result);

    expect(await service.create(createCategoryDto)).toBe(result);
    expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({ where: { name: createCategoryDto.name } });
    expect(mockCategoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
    expect(mockCategoryRepository.save).toHaveBeenCalledWith(result);
  });

  it('should throw BadRequestException if category name already exists', async () => {
    const createCategoryDto = { name: 'Existing Category' };
    const existingCategory = { id: 1, name: 'Existing Category' };
    mockCategoryRepository.findOne.mockResolvedValue(existingCategory); // Category already exists

    try {
      await service.create(createCategoryDto);
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('should update a category', async () => {
    const id = 1;
    const updateCategoryDto = { name: 'Updated Category' };
    const category = { id, name: 'Category 1' };
    const updatedCategory = { id, name: 'Updated Category' };

    mockCategoryRepository.findOne.mockResolvedValue(category);
    mockCategoryRepository.save.mockResolvedValue(updatedCategory);

    expect(await service.update(id, updateCategoryDto)).toBe(updatedCategory);
    expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(mockCategoryRepository.save).toHaveBeenCalledWith(updatedCategory);
  });

  it('should throw NotFoundException if category to update is not found', async () => {
    const id = 1;
    const updateCategoryDto = { name: 'Updated Category' };
    mockCategoryRepository.findOne.mockResolvedValue(null);

    try {
      await service.update(id, updateCategoryDto);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });

  it('should delete a category', async () => {
    const id = 1;
    const category = { id, name: 'Category 1' };
    mockCategoryRepository.findOne.mockResolvedValue(category);
    mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

    await service.delete(id);
    expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith(id);
  });

  it('should throw NotFoundException if category to delete is not found', async () => {
    const id = 1;
    mockCategoryRepository.findOne.mockResolvedValue(null);

    try {
      await service.delete(id);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});
