import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";
import {Category} from "./category.entity";
import {ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Categories Controller')
@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve all categories' })
    @ApiQuery({ name: 'skip', required: false, description: 'Number of items to skip for pagination' })
    @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
    @ApiResponse({ status: 200, description: 'List of categories returned successfully' })
    @ApiResponse({ status: 404, description: 'No categories found' })
    async findAll() {
        return await this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve category details by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Category ID to retrieve details for' })
    @ApiResponse({ status: 200, description: 'Category found and returned' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async find(@Param('id', ParseIntPipe) id: number): Promise<Category | null> {
        return await this.categoriesService.find(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request due to missing or invalid data' })
    @ApiResponse({ status: 404, description: 'Parent category not found' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an existing category' })
    @ApiParam({ name: 'id', type: Number, description: 'Category ID to update' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return await this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Category ID to delete' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.delete(id);
    }
}
