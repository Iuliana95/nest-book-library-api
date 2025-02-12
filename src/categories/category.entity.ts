import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Book} from "../books/book.entity";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true, type: 'int' })
    parentId?: number | null;

    @OneToMany(() => Book, book => book.category, { cascade: ['remove'] })
    books: Book[];
}