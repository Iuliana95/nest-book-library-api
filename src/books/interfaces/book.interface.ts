export interface Book {
    id: number;
    name: string;
    categoryId?: number | null;
    description?: string;
    author?: string;
}