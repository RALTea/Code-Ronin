import { AppError } from '$lib/errors/AppError';

export class ApprenticeNotFoundError extends AppError {
	constructor(apprenticeId: string) {
		super(`Apprentice with id ${apprenticeId} not found`, 404);
	}
}
