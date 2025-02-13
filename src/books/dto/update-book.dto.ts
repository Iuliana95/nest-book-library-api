import { CreateBookDto } from "./create-book.dto";
import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {

    @ApiProperty({
        description: 'The name of the book',
        required: false,
        example: 'The Great Gatsby'
    })
    name?: string;

    @ApiProperty({
        description: 'The author of the book',
        required: false,
        example: 'F. Scott Fitzgerald'
    })
    author?: string;

    @ApiProperty({
        description: 'The category ID of the book',
        required: false,
        example: 1
    })
    categoryId?: number;

    @ApiProperty({
        description: 'The description of the book',
        required: false,
        example: 'A story about the American dream.'
    })
    description?: string;
}