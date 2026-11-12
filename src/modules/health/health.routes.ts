import { Router, type Request, type Response } from 'express';

export const health = (req: Request, res: Response): void => {
	res.status(200).json({
		status: 'ok',
		message: 'Server is healthy',
		timestamp: new Date().toISOString(),
	});
};

const router: Router = Router();

router.get('/', health);

export default router;
