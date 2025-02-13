import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book } from "./book.entity";
import {PaginationDto} from "./dto/pagination.dto";

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        return await this.booksService.findAll(paginationDto);
    }

    @Get('category/:id')
    async findBooksFromCategory(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto): Promise<Book[]> {
        return await this.booksService.findBooksFromCategory(id, paginationDto)
    }

    @Get(':id')
    async find(@Param('id', ParseIntPipe) id: number) {
        return await this.booksService.findBook(id);
    }

    @Post()
    async create(@Body() createBookDto: CreateBookDto) {
        return await this.booksService.create(createBookDto);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
        return await this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.booksService.delete(id);
    }
}
