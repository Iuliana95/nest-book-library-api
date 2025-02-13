import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { CategoriesService } from "../categories/categories.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "./book.entity";

@Injectable()
export class BooksService {

    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private categoryService: CategoriesService,
    ) {}

    async findAll(): Promise<Book[]> {
        return await this.bookRepository.find({
            relations: ['category'],
        });
    }

    async findBooksByCategory(categoryId: number): Promise<Book[]> {
        const category = this.categoryService.find(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found.');
        }
        const books = await this.bookRepository.find({
            where: {
                category: { id: categoryId },
            },
        });
        const subcategoryBooks = this.findBooksInSubcategories(categoryId);
        return books.concat(await subcategoryBooks);
    }

    async findBooksInSubcategories(parentId: number): Promise<Book[]> {
        const subcategories = await this.categoryService.findSubcategories(parentId);
        let allSubcategoryBooks: Book[] = [];

        for (const subcategory of subcategories) {
            const books = await this.bookRepository.find({
                where: {
                    category: { id: subcategory.id },
                },
            });
            allSubcategoryBooks = [...allSubcategoryBooks, ...books];

            const nestedSubcategoryBooks = await this.findBooksInSubcategories(subcategory.id);
            allSubcategoryBooks = [...allSubcategoryBooks, ...nestedSubcategoryBooks];
        }

        return allSubcategoryBooks;
    }

    async findBook(id: number): Promise<{ book: Book; categoryPath: string[] }> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!book) {
            throw new NotFoundException('Book not found');
        }

        const categoryPaths = await this.getCategoryPaths(book.category.id);
        return { book, categoryPath: categoryPaths  };
    }

    async getCategoryPaths(categoryId: number): Promise<string[]> {
        const category = await this.categoryService.find(categoryId);

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        let paths: string[] = [];
        let path: string = category.name;

        const subcategories = await this.categoryService.findSubcategories(categoryId);
        if (subcategories && subcategories.length > 0) {
            for (const subcategory of subcategories) {
                const subcategoryPaths = await this.getCategoryPaths(subcategory.id);
                for (const subcategoryPath of subcategoryPaths) {
                    paths.push(path + ' / ' + subcategoryPath);
                }
            }
        } else {
            paths.push(path);
        }

        return paths;
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {

        const existingBook = await this.bookRepository.findOne({
            where: { name: createBookDto.name },
        });

        if (existingBook) {
            throw new BadRequestException('Book name already exists.');
        }
        if(!createBookDto.categoryId) {
            throw new NotFoundException('Category not specified.');
        }

        const category = await this.categoryService.find(createBookDto.categoryId);
        if (!category) {
            throw new NotFoundException('Category not found.');
        }

        const newBook = this.bookRepository.create({
            name: createBookDto.name,
            author: createBookDto.author,
            description: createBookDto.description,
        });

        if(category) {
            newBook.category = category;
        }

        return await this.bookRepository.save(newBook);
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {

        const book = await this.bookRepository.findOne({ where: { id } });
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        if (updateBookDto.categoryId) {
            const category = await this.categoryService.find(updateBookDto.categoryId);
            if (!category) {
                throw new NotFoundException('Category not found.');
            }
            book.category = category;
        }

        Object.assign(book, updateBookDto);

        return await this.bookRepository.save(book);
    }

    async delete(id: number): Promise<void> {
        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Book not found');
        }
    }
}
