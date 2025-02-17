import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {BooksService} from "./books.service";
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {PaginationDto} from "./dto/pagination.dto";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Prisma} from "../generated/client";

@ApiTags('Books Controller')
@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all books with pagination' })
    @ApiQuery({ name: 'skip', required: false, description: 'Number of items to skip for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page ( default is 10 if not specified )' })
    @ApiResponse({ status: 200, description: 'List of books returned successfully' })
    @ApiResponse({ status: 404, description: 'No books found' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return await this.booksService.findAll(paginationDto);
    }

    @Get('category/:id')
    @ApiOperation({ summary: 'Retrieve books from a specific category' })
    @ApiParam({ name: 'id', type: Number, description: 'Category ID to retrieve books from' })
    @ApiQuery({ name: 'skip', required: false, description: 'Number of items to skip for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page ( default is 10 if not specified )' })
    @ApiResponse({ status: 200, description: 'Books from category returned successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findBooksFromCategory(@Param('id', ParseIntPipe) id: number, @Query() paginationDto: PaginationDto): Promise<Prisma.BookGetPayload<{}>[]> {
        return await this.booksService.findBooksFromCategory(id, paginationDto)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve details of a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Book ID to retrieve details for' })
    @ApiResponse({ status: 200, description: 'Book found and returned' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    async find(@Param('id', ParseIntPipe) id: number) {
        return await this.booksService.findBook(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    @ApiBody({ type: CreateBookDto })
    @ApiResponse({ status: 201, description: 'Book created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request due to missing or invalid data' })
    async create(@Body() createBookDto: CreateBookDto) {
        return await this.booksService.create(createBookDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing book' })
    @ApiParam({ name: 'id', type: Number, description: 'Book ID to update' })
    @ApiBody({ type: UpdateBookDto })
    @ApiResponse({ status: 200, description: 'Book updated successfully' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
        return await this.booksService.update(id, updateBookDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Book ID to delete' })
    @ApiResponse({ status: 200, description: 'Book deleted successfully' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.booksService.delete(id);
    }
}
