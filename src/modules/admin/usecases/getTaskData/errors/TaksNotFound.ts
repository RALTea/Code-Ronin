import { AppError } from '$lib/errors/AppError';

export class TaskNotFound extends AppError {
	constructor() {
		super('Task not found', 404);
	}
}