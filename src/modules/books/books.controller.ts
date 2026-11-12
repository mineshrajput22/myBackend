import { type Request, type Response } from 'express';
import { getAllBooks, getBookById } from './books.service.ts';

export const getAll = (req: Request, res: Response): void => {
	const bookData = getAllBooks();

	res.status(200).json({
		success: true,
		data: bookData,
	});
};

export const getById = (req: Request<{ id: string }>, res: Response): void => {
	const id = Number(req.params.id);

	if (Number.isNaN(id)) {
		res.status(400).json({ success: false, error: 'Id must be a number' });
		return;
	}

	const book = getBookById(id);

	if (!book) {
		res.status(404).json({ success: false, error: `No Book with id ${id}` });
		return;
	}

	res.status(200).json({ success: true, data: book });
};
