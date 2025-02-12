import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import {CategoriesModule} from "../categories/categories.module";

@Module({
  imports: [ CategoriesModule ],
  controllers: [BooksController],
  providers: [BooksService]
})
export class BooksModule {}
