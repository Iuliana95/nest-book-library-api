import {IsNumber, IsOptional, IsPositive, Min} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class PaginationDto {

    @ApiProperty({
        description: 'The number of items to skip (for pagination)',
        default: 0,
        required: false,
    })
    @IsNumber()
    @Min(0)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    skip: number;

    @ApiProperty({
        description: 'The number of items per page',
        default: 10,
        required: false,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    limit: number;
}