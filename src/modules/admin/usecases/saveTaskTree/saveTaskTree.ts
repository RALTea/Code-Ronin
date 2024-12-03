import type { TaskTreeItem } from '$admin/domain/TaskTreeItem';
import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import * as ITaskTreeRepository from './repositories/ITaskTreeRepository';

type Input = InputFactory<
	{
		tree: TaskTreeItem[][];
	},
	{
		upsert: ITaskTreeRepository.UpdateTasks;
	}
>;

type Output = OutputFactory<boolean>;

export const SaveTaskTreeUseCase: UseCase<Input, Output> = (deps) => {
	const { upsert } = deps;

	return {
		execute: async ({ tree }) => {
			try {
				await upsert(tree.flat());
				return UseCaseResponseBuilder.success(200, true);
			} catch (error) {
				console.error('Failed to save task tree', error);
				return UseCaseResponseBuilder.error(500, 'Failed to save task tree');
			}
		}
	};
};