export interface Book {
    id: number;
    name: string;
    categoryIds: number[];
    description?: string;
    author?: string;
}