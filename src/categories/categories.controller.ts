import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";

@Controller('categories')
export class CategoriesController {

    constructor(private categoriesService: CategoriesService) {}

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    find(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.find(id);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.delete(id);
    }
}
