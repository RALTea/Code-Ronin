import type { TaskData } from '$admin/domain/TaskData';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import * as IEditTaskRepository from './repositories/IEditTaskRepository';

type Input = InputFactory<
	{
		taskData: TaskData;
	},
	{
		saveTaskData: IEditTaskRepository.SaveTaskData;
		saveValidation: IEditTaskRepository.SaveValidation;
	}
>;
type Output = OutputFactory<void>;

export const EditTaskUseCase: UseCase<Input, Output> = (deps) => {
	const { saveTaskData, saveValidation } = deps;
	return {
		execute: async (data) => {
			const { taskData } = data;
			await saveTaskData(taskData);
			await saveValidation({ taskId: taskData.id, ...taskData.validation });
			return UseCaseResponseBuilder.success(200, void 0);
		}
	};
};
