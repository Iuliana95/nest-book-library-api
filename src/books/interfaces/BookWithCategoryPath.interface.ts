import {Book} from "./book.interface";

export interface BookWithCategoryPath extends Book {
    categoryPath: string | null;
}