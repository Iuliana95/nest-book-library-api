import {IsInt, IsNotEmpty, IsOptional, IsString, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCategoryDto {

    @ApiProperty({
        description: 'Name of the category',
        type: String,
        example: 'Technology',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Parent category ID if the category is a subcategory',
        type: Number,
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    parentId?: number;
}