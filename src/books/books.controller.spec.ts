import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import {BooksService} from "./books.service";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {PaginationDto} from "./dto/pagination.dto";

const mockBooksService = {
  findAll: jest.fn(),
  findBooksFromCategory: jest.fn(),
  findBook: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all books with pagination', async () => {
    const paginationDto = { skip: 1, limit: 10 };
    const result = ['test'];
    mockBooksService.findAll.mockResolvedValue(result);
    expect(await controller.findAll(paginationDto)).toBe(result);
  });

  it('should return books from a category', async () => {
    const paginationDto: PaginationDto = { skip: 1, limit: 5 };
    const result = ['test'];
    mockBooksService.findBooksFromCategory.mockResolvedValue(result);
    expect(await controller.findBooksFromCategory(1, paginationDto)).toEqual(result);
  });

  it('should return a single book', async () => {
    const result = { id: 1, name: 'Test Book' };
    mockBooksService.findBook.mockResolvedValue(result);
    expect(await controller.find(1)).toEqual(result);
  });

  it('should create a new book', async () => {
    const createDto: CreateBookDto = { name: 'New Book', author: 'Author', categoryId: 1 };
    const result = { id: 1, ...createDto };
    mockBooksService.create.mockResolvedValue(result);
    expect(await controller.create(createDto)).toEqual(result);
  });

  it('should update a book', async () => {
    const updateDto: UpdateBookDto = { name: 'Updated Book' };
    const result = { id: 1, ...updateDto };
    mockBooksService.update.mockResolvedValue(result);
    expect(await controller.update(1, updateDto)).toEqual(result);
  });

  it('should delete a book', async () => {
    mockBooksService.delete.mockResolvedValue(undefined);
    await expect(controller.delete(1)).resolves.toBeUndefined();
    expect(mockBooksService.delete).toHaveBeenCalledWith(1);
  });

});