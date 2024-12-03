import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { CreateTaskDto } from './aggregates/CreateTaskDto';
import * as ICreateTaskRepository from './repositories/ICreateTaskRepository';

type Input = InputFactory<
	CreateTaskDto & {
		questId: string;
		order?: number;
	},
	{
		saveTask: ICreateTaskRepository.saveTask;
	}
>;
type Output = OutputFactory<void>;

export const CreateTaskUseCase: UseCase<Input, Output> = (deps) => {
	const { saveTask } = deps;
	return {
		execute: async (dto) => {
			await saveTask(dto);
			return UseCaseResponseBuilder.success(200, void 0);
		}
	};
};
