import {IsNumber, IsOptional, IsPositive} from "class-validator";
import {Transform} from "class-transformer";

export class PaginationDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    skip: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    limit: number;
}