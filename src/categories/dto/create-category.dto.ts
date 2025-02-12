import {IsInt, IsNotEmpty, IsOptional, IsString, Min} from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    parentId?: number;
}