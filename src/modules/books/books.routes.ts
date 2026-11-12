import { Router } from 'express';
import { getAll, getById } from './books.controller.ts';

const router: Router = Router();

router.get('/', getAll);
router.get('/:id', getById);

export default router;
