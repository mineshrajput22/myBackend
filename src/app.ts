import express, {
	type Application,
	type Request,
	type Response,
} from 'express';

const app: Application = express();

app.disable('x-powered-by')
app.use(express.json());

export const health = (req: Request, res: Response) => {
	res.status(200).json({
		status: 'ok',
		message: 'Server is healthy',
		timestamp: new Date().toISOString(),
	});
};

app.get('/health', health);

export default app;
