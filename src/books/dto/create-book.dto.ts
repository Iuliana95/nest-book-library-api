import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';

export class CreateBookDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @Min(1)
    categoryId: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    author?: string;
}