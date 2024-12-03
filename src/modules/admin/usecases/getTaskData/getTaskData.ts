import type { TaskData } from '$admin/domain/TaskData';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import * as IGetTaskDataRepository from './repositories/IGetTaskDataRepository';

type Input = InputFactory<
	{
		taskId: string;
	},
	{
		getTaskData: IGetTaskDataRepository.GetTaskData;
	}
>;
type Output = OutputFactory<TaskData>;

export const GetTaskDataUseCase: UseCase<Input, Output> = (deps) => {
	const { getTaskData } = deps;
	return {
		execute: async ({ taskId }) => {
			const taskData = await getTaskData(taskId);
			return UseCaseResponseBuilder.success(200, taskData);
		}
	};
};
