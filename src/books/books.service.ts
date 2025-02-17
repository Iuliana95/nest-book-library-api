import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {CategoriesService} from "../categories/categories.service";
import {PaginationDto} from "./dto/pagination.dto";
import {DEFAULT_PAGE_SIZE} from "./utils/constants";
import {DatabaseService} from "../database/database.service";
import {Prisma} from "../generated/client";

@Injectable()
export class BooksService {

    constructor(
        private readonly prisma: DatabaseService,
        private categoryService: CategoriesService,
    ) {}

    async findAll(paginationDto: PaginationDto): Promise<Prisma.BookGetPayload<{}>[]> {
        const books = await this.prisma.book.findMany({
            include: { category: true },
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });

        return books;
    }

    async findBooksFromCategory(categoryId: number, paginationDto: PaginationDto): Promise<Prisma.BookGetPayload<{}>[]> {
        const category = await this.categoryService.find(categoryId);
        if (!category) {
            throw new NotFoundException('Category not found.');
        }

        const allCategoryIds = await this.getAllSubcategoryIds(categoryId);
        const books = await this.prisma.book.findMany({
            where: {
                categoryId: {in: allCategoryIds},
            },
            include: {category: true},
            skip: paginationDto.skip,
            take: paginationDto.limit ?? DEFAULT_PAGE_SIZE,
        });

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

    async findBookById(id:number): Promise<Prisma.BookGetPayload<{}>> {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!book) {
            throw new NotFoundException('Book not found');
        }

        return book;
    }

    async findBook(id: number): Promise<{ book: Prisma.BookGetPayload<{}>, categoryPath: string[] }> {
        const book = await this.findBookById(id);
        const categoryPaths = await this.getCategoryPaths(book.categoryId);
        return { book, categoryPath: categoryPaths };
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

    async create(createBookDto: CreateBookDto): Promise<Prisma.BookGetPayload<{}>> {

        const existingBook = await this.prisma.book.findUnique({
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

        const createdBook = await this.prisma.book.create({
            data: {
                name: createBookDto.name,
                author: createBookDto.author,
                description: createBookDto.description,
                category: {
                    connect: { id: createBookDto.categoryId },
                },
            },
        });

        return createdBook;
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Prisma.BookGetPayload<{}>> {

        await this.findBookById(id);

        if (updateBookDto.categoryId) {
            const category = await this.categoryService.find(updateBookDto.categoryId);
            if (!category) {
                throw new NotFoundException('Category not found.');
            }
        }

        const { name, author, description } = updateBookDto;

        const updatedBook = await this.prisma.book.update({
            where: { id },
            data: {
                name,
                author,
                description,
                category: updateBookDto.categoryId
                    ? { connect: { id: updateBookDto.categoryId } }
                    : undefined,
            },
        });

        return updatedBook;
    }

    async delete(id: number): Promise<void> {
        const result = await this.prisma.book.delete({
            where: { id },
        }).catch(() => null);

        if (!result) {
            throw new NotFoundException('Book not found');
        }
    }
}
