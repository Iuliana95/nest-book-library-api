import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CategoriesModule } from "../categories/categories.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book.entity";

@Module({
  imports: [ CategoriesModule, TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService]
})

export class BooksModule {}
