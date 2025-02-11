import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, BooksModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
