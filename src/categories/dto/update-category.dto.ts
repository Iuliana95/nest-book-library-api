import { CreateCategoryDto } from "./create-category.dto";
import { PartialType } from "@nestjs/mapped-types";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

    @ApiProperty({
        description: 'Name of the category',
        type: String,
        example: 'New Technology',
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: 'Parent category ID if the category is a subcategory',
        type: Number,
        example: 2,
        required: false,
    })
    parentId?: number;
}