import { ApplicationError } from '$lib/ddd-common/errors/ApplicationError';
import type { TaskId } from '$learning/domain/TaskId.valueObject';

export class TaskNotFoundError extends ApplicationError {
	constructor(taskId: TaskId) {
		super(`Task with ID "${taskId.toString()}" was not found.`);
		this.name = 'TaskNotFoundError';
	}
}
