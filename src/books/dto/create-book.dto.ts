import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {

    @ApiProperty({
        description: "The name of the book",
        example: "The Great Gatsby",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "The ID of the category the book belongs to",
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({
        description: "A description of the book",
        example: "A story about the American dream.",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "The author of the book",
        example: "F. Scott Fitzgerald",
    })
    @IsNotEmpty()
    @IsString()
    author: string;
}