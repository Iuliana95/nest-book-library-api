import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Category} from "./interfaces/category.interface";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {UpdateCategoryDto} from "./dto/update-category.dto";

@Injectable()
export class CategoriesService {

    private categories: Category[] = [
        { id: 1, name: "Fiction" },
        { id: 2, name: "Science Fiction", parentId: 1 },
        { id: 3, name: "Fantasy", parentId: 1 },
        { id: 4, name: "Non-Fiction"},
        { id: 5, name: "Biography", parentId: 4 },
        { id: 6, name: "History", parentId: 4 }
    ];

    findAll() {
        return this.categories;
    }

    create(createCategoryDto: CreateCategoryDto) {
        const existingCategory = this.categories.find(category => category.name === createCategoryDto.name);
        if (existingCategory) {
            throw new BadRequestException('Category name already exists.');
        }
        const uniqueId = this.categories.length ? Math.max(...this.categories.map(cat => cat.id)) + 1 : 1;
        const newCategory: Category = {
            id: uniqueId,
            name: createCategoryDto.name
        };
        if(createCategoryDto.parentId) {
            newCategory.parentId = createCategoryDto.parentId;
        }
        this.categories.push(newCategory);
        return newCategory;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto): Category {
        const categoryIndex = this.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (updateCategoryDto.parentId !== undefined) {
            if (updateCategoryDto.parentId === id) {
                throw new BadRequestException("A category cannot be its own parent.");
            }

            const parentCategory = this.categories.find(cat => cat.id === updateCategoryDto.parentId);
            if (!parentCategory) {
                throw new NotFoundException(`Parent category with ID ${updateCategoryDto.parentId} not found`);
            }
        }

        this.categories[categoryIndex] = {
            ...this.categories[categoryIndex],
            ...updateCategoryDto
        };

        return this.categories[categoryIndex];
    }

    delete(id: number): Category | void {
        const categoryIndex = this.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
            throw new NotFoundException(`Category with ID ${id} not found.`);
        }
        const deletedCategory = this.categories[categoryIndex];
        this.categories = this.categories.map(cat => {
            if(cat.parentId === id) {
                cat.parentId = null;
            }
            return cat;
        });

        this.categories.splice(categoryIndex, 1);
        return deletedCategory;
    }
}
