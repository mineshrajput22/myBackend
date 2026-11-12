import books from '../../data/booksData.ts';
import { type Book } from '../../types/book.ts';

export const getAllBooks = () => {
	return books;
};

export const getBookById = (id: number) : Book | undefined => {
	return books.find((item) => item.id === id);
};
