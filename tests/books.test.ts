import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.ts';

describe('GET /api/v1/books/:id', () => {
	it('return 400 when the book ID is invalid', async () => {
		const response = await request(app).get('/api/v1/books/abc');

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject({
			success: false,
			error: 'Id must be a number',
		});
	});

	it('returns 404 when the book does not exist', async () => {
		const response = await request(app).get('/api/v1/books/999');
		expect(response.status).toBe(404);
		expect(response.body).toMatchObject({
			success: false,
			error: 'No Book with id 999',
		});
		expect(response.body).toHaveProperty('error');
	});
});
