import { AppError } from '$lib/errors/AppError';

export class UnauthorizedError extends AppError {
	constructor() {
		super('Unauthorized', 401);
	}
}