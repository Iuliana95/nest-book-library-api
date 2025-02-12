import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./interfaces/book.interface";
import {CategoriesService} from "../categories/categories.service";
import {BookWithCategoryPath} from "./interfaces/BookWithCategoryPath.interface";

@Injectable()
export class BooksService {

    constructor(private categoryService: CategoriesService) {}

    private books: Book[] = [
        { id: 1, name: 'The Lord of the Rings', description: 'A fantasy epic by J.R.R. Tolkien', categoryId: 3 },
        { id: 2, name: 'Pride and Prejudice', description: 'A romantic novel by Jane Austen', categoryId: 1 },
        { id: 3, name: 'To Kill a Mockingbird', description: 'A novel by Harper Lee', categoryId: 1 },
        { id: 4, name: 'Foundation', description: 'A science fiction novel by Isaac Asimov', categoryId: 2 },
        { id: 5, name: 'Einstein\'s Biography', description: 'A biography of Albert Einstein', categoryId: 5 },
        { id: 6, name: 'The Hobbit', description: 'A prequel to The Lord of the Rings', categoryId: 3 },
        { id: 7, name: 'The Great Gatsby', description: 'A classic novel by F. Scott Fitzgerald', categoryId: 1 },
        { id: 8, name: 'Dune', description: 'A science fiction novel by Frank Herbert', categoryId: 2 },
        { id: 9, name: 'Sapiens: A Brief History of Humankind', description: 'A non-fiction book by Yuval Noah Harari', categoryId: 4 },
        { id: 10, name: 'History of the World', description: 'A history book covering global events', categoryId: 6 },
        { id: 11, name: 'The Diary of a Young Girl', description: 'A biography of Anne Frank', categoryId: 5 },
        { id: 12, name: 'The Universe in a Nutshell', description: 'A science book by Stephen Hawking', categoryId: 2 },
        { id: 13, name: 'A Brief History of Time', description: 'A scientific book by Stephen Hawking', categoryId: 2 },
        { id: 14, name: 'The Art of War', description: 'An ancient Chinese military treatise', categoryId: 6 },
        { id: 15, name: 'The Catcher in the Rye', description: 'A classic novel by J.D. Salinger', categoryId: 1 },
        { id: 16, name: 'TEST 1', description: 'TEST', categoryId: 3 },
        { id: 17, name: 'TEST 2', description: 'TEST', categoryId: 9 },
    ];

    findAll() {
       return this.books;
    }

    findBooksByCategory(categoryId: number): any[] {
        const category = this.categoryService.find(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found.');
        }
        const books = this.books.filter(book => book.categoryId === categoryId);
        const subcategoryBooks = this.findBooksInSubcategories(categoryId);
        return books.concat(subcategoryBooks);
    }

    private findBooksInSubcategories(parentId: number): Book[] {
        const subcategories = this.categoryService.findSubcategories(parentId);
        let allSubcategoryBooks: Book[] = [];

        for (const subcategory of subcategories) {
            const books = this.books.filter(book => book.categoryId === subcategory.id);
            allSubcategoryBooks = allSubcategoryBooks.concat(books);
            const nestedSubcategoryBooks = this.findBooksInSubcategories(subcategory.id)
            allSubcategoryBooks = allSubcategoryBooks.concat(nestedSubcategoryBooks)
        }

        return allSubcategoryBooks;
    }

    findOneWithCategoryPath(id: number): BookWithCategoryPath {
        const book = this.books.find(b => b.id === id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        let categoryPath: string | null = null; // Initialize as null

        if (book.categoryId) {
            categoryPath = this.getCategoryPath(book.categoryId);
        }

        return { ...book, categoryPath }; // Return the combined object
    }

    private getCategoryPath(categoryId: number): string {
        const category = this.categoryService.find(categoryId);

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        let path = category.name;

        if (category.parentId) {
            path = this.getCategoryPath(category.parentId) + ' / ' + path; // Recursive call
        }

        return path;
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
