import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {Category} from "../categories/category.entity";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: false })
    author: string;

    @ManyToOne(() => Category, category => category.books, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ nullable: true })
    description?: string;
}