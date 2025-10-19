import type { ApprenticeId } from '$learning/ApprenticeId.valueObject';
import { Attempt } from '$learning/domain/Attempt.aggregate';
import type { IAttemptRepository } from '$learning/domain/interfaces/IAttemptRepository';
import type { ITaskRepository } from '$learning/domain/interfaces/ITaskRepository';
import type { TaskId } from '$learning/domain/TaskId.valueObject';
import { TaskNotFoundError } from './errors/TaskNotFoundError';

export type AttemptTaskCommand = {
	apprenticeId: ApprenticeId;
	taskId: TaskId;
	apprenticeSolution: string;
};

export class AttemptTaskUsecase {
	constructor(
		private readonly attemptRepository: IAttemptRepository,
		private readonly taskRepository: ITaskRepository
	) {}

	async execute(command: AttemptTaskCommand) {
		const { apprenticeId, taskId, apprenticeSolution } = command;
		const task = await this.taskRepository.findById(taskId);
		if (!task) {
			throw new TaskNotFoundError(taskId);
		}

		const attempt = Attempt.create(apprenticeId, taskId, task.language, apprenticeSolution);

		await this.attemptRepository.save(attempt);
	}
}
