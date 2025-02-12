import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {BookWithCategoryPath} from "./interfaces/BookWithCategoryPath.interface";

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @Get('category/:id')
    findBooksByCategory(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findBooksByCategory(id)
    }

    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number): BookWithCategoryPath {
        return this.booksService.findOneWithCategoryPath(id);
    }

    @Post()
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.delete(id);
    }
}
