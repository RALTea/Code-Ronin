import { AppError } from '$lib/errors/AppError';

export class TestCasesNotFoundError extends AppError {
	constructor(file: string) {
		super(`Failed to fetch the file content ${file}`, 404);
	}
}
