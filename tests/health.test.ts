import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.ts';

describe('GET / health', () => {
	it('should return 200 and a healthy status', async () => {
		// 1. Send GET /health
		const response = await request(app).get('/health');
		// 2. Assert HTTP status
		expect(response.status).toBe(200);

		// 3. Assert response.body.status
		expect(response.body.status).toBe('ok');

		// 4. Assert response.body.message
		expect(response.body.message).toBe('Server is healthy');

		expect(typeof response.body.timestamp).toBe('string');
	});
});
