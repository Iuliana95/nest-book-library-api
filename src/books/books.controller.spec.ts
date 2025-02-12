import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import {BooksService} from "./books.service";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    findAll: jest.fn(() => ['book1', 'book2']),
    findBooksByCategory: jest.fn((id) => [`book-category-${id}`]),
    findOneWithCategoryPath: jest.fn((id) => ({ id, title: 'Book Title', categoryPath: 'Category > Subcategory' })),
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    delete: jest.fn((id) => ({ deleted: true, id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should return all books', () => {
    expect(controller.findAll()).toEqual(['book1', 'book2']);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return books by category', () => {
    expect(controller.findBooksByCategory(1)).toEqual(['book-category-1']);
    expect(service.findBooksByCategory).toHaveBeenCalledWith(1);
  });

  it('should return a single book with category path', () => {
    expect(controller.find(1)).toEqual({ id: 1, title: 'Book Title', categoryPath: 'Category > Subcategory' });
    expect(service.findOneWithCategoryPath).toHaveBeenCalledWith(1);
  });

  it('should create a book', () => {
    const dto: CreateBookDto = { name: 'New Book', categoryId: 1, description: 'A great book', author: 'Author' };
    expect(controller.create(dto)).toEqual({ id: 1, name: 'New Book', categoryId: 1, description: 'A great book', author: 'Author' });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a book', () => {
    const dto: UpdateBookDto = { name: 'Updated Book' };
    expect(controller.update(1, dto)).toEqual({ id: 1, name: 'Updated Book' });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a book', () => {
    expect(controller.delete(1)).toEqual({ deleted: true, id: 1 });
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});