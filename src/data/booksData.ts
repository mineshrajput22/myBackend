import type { Book } from '../types/book.ts';

export const booksData: Book[] = [
	{
		id: 1,
		title: 'The Pragmatic Programmer',
		author: 'Andrew Hunt',
		year: 1999,
		genre: 'Engineering',
		available: true,
	},
	{
		id: 2,
		title: 'Refactoring',
		author: 'Martin Fowler',
		year: 2018,
		genre: 'Engineering',
		available: true,
	},
	{
		id: 3,
		title: 'Clean Code',
		author: 'Robert C. Martin',
		year: 2008,
		genre: 'Engineering',
		available: false,
	},
	{
		id: 4,
		title: 'Sapiens',
		author: 'Yuval Noah Harari',
		year: 2011,
		genre: 'History',
		available: true,
	},
	{
		id: 5,
		title: 'Deep Work',
		author: 'Cal Newport',
		year: 2016,
		genre: 'Productivity',
		available: false,
	},
];

export default booksData;
