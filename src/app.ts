import express, {
	type Application,
	type Request,
	type Response,
} from 'express';

import booksRouter from './modules/books/books.routes.ts';

const app: Application = express();

app.disable('x-powered-by');
app.use(express.json());

export const health = (req: Request, res: Response) => {
	res.status(200).json({
		status: 'ok',
		message: 'Server is healthy',
		timestamp: new Date().toISOString(),
	});
};

app.get('/health', health);

app.use('/api/v1/books', booksRouter);

export default app;
