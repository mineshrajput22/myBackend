import express, {
	type Application,
	type Request,
	type Response,
} from 'express';

const app: Application = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
	res
		.status(200)
		.json({
			status: 'OK',
			timestamp: new Date().toISOString(),
			message: 'Node + typescript server is running',
		});
});

export default app;
