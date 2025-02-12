import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./interfaces/book.interface";
import {CategoriesService} from "../categories/categories.service";

@Injectable()
export class BooksService {

    constructor(private categoryService: CategoriesService) {}

    private books: Book[] = [
        {
            id: 1,
            name: 'The Lord of the Rings',
            description: 'A fantasy epic by J.R.R. Tolkien'
        },
        {
            id: 2,
            name: 'Pride and Prejudice',
            description: 'A romantic novel by Jane Austen'
        },
        {
            id: 3,
            name: 'To Kill a Mockingbird',
            description: 'A novel by Harper Lee'
        },
    ];

    findAll() {
       return this.books;
    }

    create(createBookDto: CreateBookDto) {
        const existingBook = this.books.find(book => book.name === createBookDto.name);
        if (existingBook) {
            throw new BadRequestException('Book name already exists.');
        }

        if(createBookDto.categoryId) {
            const categoryExists = this.categoryService.find(createBookDto.categoryId);
            if(!categoryExists) {
                throw new NotFoundException('Category not found.');
            }
        }

        const uniqueId = this.books.length ? Math.max(...this.books.map(book => book.id)) + 1 : 1;
        const newBook: Book = {
            id: uniqueId,
            ...createBookDto,
        };
        this.books.push(newBook);
        return newBook;
    }

    update(id: number, updateBookDto: UpdateBookDto) {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new NotFoundException('Book not found');
        }

        if (updateBookDto.categoryId) {
            const categoryExists = this.categoryService.find(updateBookDto.categoryId);
            if (!categoryExists) {
                throw new NotFoundException('Category not found.');
            }
        }

        this.books[bookIndex] = { ...this.books[bookIndex], ...updateBookDto };
        return this.books[bookIndex];
    }

    delete(id: number) {
        const bookIndex = this.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new NotFoundException('Book not found');
        }
        this.books.splice(bookIndex, 1);
    }
}
