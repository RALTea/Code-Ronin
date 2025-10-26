import type { ApprenticeId } from '$learning/domain/ApprenticeId.valueObject';
import { Attempt } from '$learning/domain/Attempt.aggregate';
import type { IAttemptRepository } from '$learning/domain/interfaces/IAttemptRepository';
import type { ICodeBuilder } from '$learning/domain/interfaces/ICodeBuilder';
import type { ICodeEvaluationService } from '$learning/domain/interfaces/ICodeEvaluationService';
import type { ITaskRepository } from '$learning/domain/interfaces/ITaskRepository';
import type { TaskId } from '$learning/domain/TaskId.valueObject';
import { TaskNotFoundError } from './errors/TaskNotFoundError';

export type AttemptTaskCommand = {
	apprenticeId: ApprenticeId;
	taskId: TaskId;
	apprenticeSolution: string;
};

export type AttemptTaskUsecaseOutput = {
	success: boolean;
};

export class AttemptTaskUsecase {
	constructor(
		private readonly attemptRepository: IAttemptRepository,
		private readonly taskRepository: ITaskRepository,
		private readonly codeBuilder: ICodeBuilder,
		private readonly codeEvaluationService: ICodeEvaluationService
	) {}

	async execute(command: AttemptTaskCommand): Promise<AttemptTaskUsecaseOutput> {
		const { apprenticeId, taskId, apprenticeSolution } = command;
		const task = await this.taskRepository.findById(taskId);
		if (!task) {
			throw new TaskNotFoundError(taskId);
		}

		const attempt = Attempt.create(apprenticeId, taskId, task.language, apprenticeSolution);

		const codeToRun = await this.codeBuilder.buildCode(attempt.apprenticeSolution, '');
		const evaluationResult = await this.codeEvaluationService.evaluateCode(
			codeToRun,
			attempt.language
		);

		await this.attemptRepository.save(attempt);

		return {
			success: false
		};
	}
}
