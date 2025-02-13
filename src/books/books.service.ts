import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { CategoriesService } from "../categories/categories.service";
import { InjectRepository } from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import { Book } from "./book.entity";
import {PaginationDto} from "./dto/pagination.dto";
import {DEFAULT_PAGE_SIZE} from "./utils/constants";

@Injectable()
export class BooksService {

    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
        private categoryService: CategoriesService,
    ) {}

    async findAll(paginationDto: PaginationDto): Promise<Book[]> {
        return await this.bookRepository.find({
            relations: ['category'],
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE
        });
    }

    async findBooksFromCategory(categoryId: number, paginationDto: PaginationDto): Promise<Book[]> {
        const category = await this.categoryService.find(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found.');
        }

        const allCategoryIds = await this.getAllSubcategoryIds(categoryId);
        const books = await this.bookRepository.find({
            where: {
                category: {
                    id: In(allCategoryIds),
                },
            },
            relations: ['category'],
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE
        });

        // const books = await this.bookRepository
        //     .createQueryBuilder('book')
        //     .innerJoinAndSelect('book.category', 'category')
        //     .where(`book.categoryId IN (
        //         WITH RECURSIVE CategoryTree AS (
        //             SELECT id
        //             FROM category
        //             WHERE "parentId" = :categoryId
        //
        //             UNION ALL
        //
        //             SELECT c.id
        //             FROM category c
        //             INNER JOIN CategoryTree ct ON c."parentId" = ct.id
        //         )
        //         SELECT id FROM CategoryTree
        //         UNION
        //         SELECT :categoryId
        //       )`, { categoryId })
        //     .skip(paginationDto.skip)
        //     .take(paginationDto.limit ?? DEFAULT_PAGE_SIZE)
        //     .getMany();

        return books;
    }

    private async getAllSubcategoryIds(categoryId: number): Promise<number[]> {
        const subcategories = await this.categoryService.findSubcategoriesIds(categoryId);
        const subcategoryIds = subcategories.map(subcategoryId => subcategoryId);
        const nestedSubcategoryIds = await Promise.all(
            subcategories.map(async (subcategoryId) => {
                return this.getAllSubcategoryIds(subcategoryId);
            }
        ));
        return [categoryId, ...subcategoryIds, ...nestedSubcategoryIds.flat()];
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
