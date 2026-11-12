import express, { type Application } from 'express';

import booksRouter from './modules/books/books.routes.ts';
import healthRouter from './modules/health/health.routes.ts';

const app: Application = express();

app.disable('x-powered-by');
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/v1/books', booksRouter);

app.use((_req, res) => {
	res.status(404).json({ success: false, error: 'Route not found' });
});

export default app;
