import { AppError } from '$lib/errors/AppError';

export class QuestHasNoTasksError extends AppError {
	constructor(name: string = '') {
		super(`Quest ${name} has no tasks`, 400);
	}
}