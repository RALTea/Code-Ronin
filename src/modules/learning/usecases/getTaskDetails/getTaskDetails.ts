import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import { extractError } from '$lib/utils/error.utils';
import type { TaskDetails } from './aggregates/TaskDetails';
import * as IGetTaskDetailsRepository from './repositories/IGetTaskDetailsRepository';

type Input = InputFactory<
	{ taskId: string },
	{ getTaskDetails: IGetTaskDetailsRepository.GetTaskDetails }
>;
type Output = OutputFactory<TaskDetails>;

export const getTaskDetails: UseCase<Input, Output> = (deps) => {
	const { getTaskDetails } = deps;
	return {
		execute: async ({ taskId }) => {
			try {
				const taskDetails = await getTaskDetails(taskId);
				return UseCaseResponseBuilder.success(200, taskDetails);
			} catch (error) {
				console.error(extractError(error));
				return UseCaseResponseBuilder.error(500, 'Failed to fetch task details');
			}
		}
	};
};
