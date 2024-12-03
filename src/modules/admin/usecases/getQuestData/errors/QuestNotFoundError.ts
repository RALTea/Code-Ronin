import { AppError } from '$lib/errors/AppError';

export class QuestNotFoundError extends AppError {
	constructor(questId: string) {
		super(`Quest with id ${questId} not found`, 404);
	}
}