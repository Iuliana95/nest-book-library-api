import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Category} from "./interfaces/category.interface";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {

    private categories: Category[] = [];

    findAll() {
        return this.categories;
    }

    create(createCategoryDto: CreateCategoryDto) {
        const existingCategory = this.categories.find(category => category.name === createCategoryDto.name);
        if (existingCategory) {
            throw new BadRequestException('Category name already exists.');
        }
        const categoriesByHighestId = [...this.categories].sort((a,b) => b.id - a.id);
        const uniqueId = categoriesByHighestId[0].id + 1;

        const newCategory: Category = {
            id: uniqueId,
            name: createCategoryDto.name,
            parent: createCategoryDto.parentId ? this.categories.find(c => c.id === createCategoryDto.parentId) : undefined,
        };
        this.categories.push(newCategory);
        return newCategory;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto): Category {
        const categoryIndex = this.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
            throw new NotFoundException('Category not found');
        }

        const updatedCategory: Category = { ...this.categories[categoryIndex], ...updateCategoryDto };
        if (updateCategoryDto.parentId) {
            updatedCategory.parent = this.categories.find(c => c.id === updateCategoryDto.parentId);
        }

        this.categories[categoryIndex] = updatedCategory;
        return updatedCategory;
    }

    delete(id: number): void {
        const categoryIndex = this.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
            throw new NotFoundException('Category not found');
        }
        const categoryToDelete = this.categories[categoryIndex];
        this.removeSubcategories(categoryToDelete);
        this.categories.splice(categoryIndex, 1);
    }

    private removeSubcategories(category: Category): void {
        const subcategories = this.categories.filter(c => c.parent?.id === category.id);
        subcategories.forEach(subcategory => {
            this.removeSubcategories(subcategory);
            this.categories.splice(this.categories.indexOf(subcategory), 1);
        });
    }

}
