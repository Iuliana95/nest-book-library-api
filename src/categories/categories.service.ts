import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async find(id: number): Promise<Category | null> {
        return await this.categoryRepository.findOne({ where: { id } });
    }

    async findSubcategories(parentId: number): Promise<Category[]> {
        const categories = await this.categoryRepository.find();
        return categories.filter(c => c.parentId === parentId);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {

        const existingCategory = await this.categoryRepository.findOne({
            where: { name: createCategoryDto.name },
        });
        if (existingCategory) {
            throw new BadRequestException('Category name already exists.');
        }

        if (createCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOne({
                where: { id: createCategoryDto.parentId },
            });

            if (!parentCategory) {
                throw new NotFoundException('Parent category not found.');
            }
        }

        const newCategory = await this.categoryRepository.create({
            name: createCategoryDto.name,
            parentId: createCategoryDto.parentId
        });

        return await this.categoryRepository.save(newCategory);
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (updateCategoryDto.parentId) {
            const parentCategory = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });

            if (!parentCategory) {
                throw new NotFoundException('Parent category not found.');
            }

            category.parentId = updateCategoryDto.parentId;
        }

        Object.assign(category, updateCategoryDto);

        return await this.categoryRepository.save(category);
    }

    async delete(id: number): Promise<void> {

        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        await this.categoryRepository.update({ parentId: id }, { parentId: null });

        const result = await this.categoryRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Category not found');
        }
    }
}
