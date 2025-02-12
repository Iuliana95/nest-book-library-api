import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    categoryId: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    author: string;
}