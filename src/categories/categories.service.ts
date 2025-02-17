import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {DatabaseService} from "../database/database.service";
import {Prisma} from "../generated/client";

@Injectable()
export class CategoriesService {

    constructor(
        private readonly prisma: DatabaseService,
    ) {}

    async findAll(): Promise<Prisma.CategoryGetPayload<{}>[]> {
        const categories = await this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
                parentId: true,
            },
        });
        return categories;
    }

    async find(id: number): Promise<Prisma.CategoryGetPayload<{}>> {

        const category = await this.prisma.category.findUnique({
            where: { id },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async findSubcategories(parentId: number): Promise<Prisma.CategoryGetPayload<{}>[]> {
        const categories = await this.prisma.category.findMany({
            where: { parentId },
        });

        return categories;
    }

    async findSubcategoriesIds(parentId: number): Promise<number[]> {
        const categories = await this.prisma.category.findMany({
            where: { parentId },
            select: { id: true },
        });

        return categories.map(c => c.id);
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {

        const existingCategory = await this.prisma.category.findUnique({
            where: { name: createCategoryDto.name },
        });

        if (existingCategory) {
            throw new BadRequestException('Category name already exists.');
        }

        if (createCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: createCategoryDto.parentId },
            });

            if (!parentCategory) {
                throw new NotFoundException('Parent category not found.');
            }
        }

        const createdCategory = this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                parentId: createCategoryDto.parentId ?? null,
            },
        });

        return createdCategory;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Prisma.CategoryGetPayload<{}>> {

        await this.find(id);

        if(updateCategoryDto.name) {
            const existingCategory = await this.prisma.category.findUnique({
                where: { name: updateCategoryDto.name }
            });

            if (existingCategory) {
                throw new BadRequestException('Category name already exists.');
            }
        }

        if (updateCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: updateCategoryDto.parentId },
            });

            if (!parentCategory) {
                throw new NotFoundException('Parent category not found.');
            }
        }

        const updatedCategory = this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
        });

        return updatedCategory;
    }

    async delete(id: number): Promise<void> {

        await this.find(id);

        await this.prisma.category.updateMany({
            where: { parentId: id },
            data: { parentId: null },
        });

        await this.prisma.category.delete({ where: { id } });
    }
}
