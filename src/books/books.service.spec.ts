import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import {Book} from "./book.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CategoriesService} from "../categories/categories.service";
import {BadRequestException, NotFoundException} from "@nestjs/common";

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  create: jest.fn()
};

const mockCategoryService = {
  find: jest.fn(),
  findSubcategoriesIds: jest.fn(),
};

const mockCategory = { id: 1, name: 'Tech',  books: [] };

const mockBook = {
  id: 1,
  name: 'Test Book',
  author: 'Author Name',
  category: mockCategory,
};

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: CategoriesService, useValue: mockCategoryService },
        { provide: getRepositoryToken(Book), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all books', async () => {
    mockRepository.find.mockResolvedValue(mockBook);
    const result = await service.findAll({ skip: 0, limit: 10 });
    expect(result).toEqual(mockBook);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['category'],
      skip: 0,
      take: 10,
    });
  });

  it('should return a book with category path', async () => {
    mockRepository.findOne.mockResolvedValue(mockBook);

    service.getCategoryPaths = jest.fn().mockResolvedValue([
      "Fantasy / High Fantasy / Epic Fantasy / Gothic Fiction",
      "Fantasy / High Fantasy / Epic Fantasy / Romantic Fiction",
      "Fantasy / High Fantasy / Mythic Fantasy",
      "Fantasy / High Fantasy / Victorian Era / Heroic Fantasy",
      "Fantasy / High Fantasy / Victorian Era / Supernatural Fantasy",
      "Fantasy / Urban Fantasy / Modern Era"
    ]);

    const result = await service.findBook(13);

    expect(result).toEqual({
      book: mockBook,
      categoryPath: [
        "Fantasy / High Fantasy / Epic Fantasy / Gothic Fiction",
        "Fantasy / High Fantasy / Epic Fantasy / Romantic Fiction",
        "Fantasy / High Fantasy / Mythic Fantasy",
        "Fantasy / High Fantasy / Victorian Era / Heroic Fantasy",
        "Fantasy / High Fantasy / Victorian Era / Supernatural Fantasy",
        "Fantasy / Urban Fantasy / Modern Era"
      ]
    });

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 13 },
      relations: ['category'],
    });

    expect(service.getCategoryPaths).toHaveBeenCalledWith(mockBook.category.id);
  });

  it('should throw NotFoundException if book does not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.findBook(999)).rejects.toThrow(NotFoundException);
  });

  it('should create a new book', async () => {
    const createBookDto = { name: 'New Book', author: 'Author', description: 'Desc', categoryId: 1 };
    mockCategoryService.find.mockResolvedValue(mockCategory);
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.create = jest.fn().mockReturnValue({ ...createBookDto, category: mockCategory });
    mockRepository.save.mockResolvedValue({ id: 1, ...createBookDto, category: mockCategory });

    const result = await service.create(createBookDto);
    expect(result).toEqual({ id: 1, ...createBookDto, category: mockCategory });
  });

  it('should throw BadRequestException if book name already exists', async () => {
    mockRepository.findOne.mockResolvedValue({ id: 1, name: 'Existing Book' });
    await expect(service.create({name: 'Existing Book', author: 'Author Name', categoryId: 1})).rejects.toThrow(BadRequestException);
  });

  it('should update a book', async () => {
    const updateBookDto = { name: 'Updated Book' };
    const existingBook = { id: 1, name: 'Old Book' };

    mockRepository.findOne.mockResolvedValue(existingBook);
    mockRepository.save.mockResolvedValue({ ...existingBook, ...updateBookDto });

    const result = await service.update(1, updateBookDto);
    expect(result).toEqual({ id: 1, name: 'Updated Book' });
  });

  it('should throw NotFoundException if book to update does not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.update(999, { name: 'Non-existent' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a book', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });

    await expect(service.delete(1)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if book to delete does not exist', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.delete(999)).rejects.toThrow(NotFoundException);
  });
});
