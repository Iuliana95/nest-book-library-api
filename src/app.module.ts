import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      BooksModule, CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
