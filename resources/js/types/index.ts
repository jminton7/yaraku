// src/types/index.ts

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
}

export interface PageProps {
    books: Book[];
    search: string;
    sortField: string;
    sortDirection: 'asc' | 'desc';
    [key: string]: unknown;
}
