import { AppError } from '$lib/errors/AppError';

export class ParsingError extends AppError {
	constructor(cause?: string) {
		super(`ParsingError: ${cause ?? 'Unknown cause'}`, 400);
	}
}