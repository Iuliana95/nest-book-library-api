import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./interfaces/book.interface";

@Injectable()
export class BooksService {

    private books: Book[] = [
        {
            id: 1,
            name: 'The Lord of the Rings',
            description: 'A fantasy epic by J.R.R. Tolkien',
            categoryIds: [1, 2],
        },
        {
            id: 2,
            name: 'Pride and Prejudice',
            description: 'A romantic novel by Jane Austen',
            categoryIds: [3],
        },
        {
            id: 3,
            name: 'To Kill a Mockingbird',
            description: 'A novel by Harper Lee',
            categoryIds: [4],
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
        const booksByHighestId = [...this.books].sort((a,b) => b.id - a.id);
        const uniqueId = booksByHighestId[0].id + 1;
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
