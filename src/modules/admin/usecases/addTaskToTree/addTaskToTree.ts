import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { TaskTreeItem } from '../../domain/TaskTreeItem';

type Input = InputFactory<
	{
		tree: TaskTreeItem[][];
		task: TaskTreeItem;
	},
	void
>;

type Output = OutputFactory<TaskTreeItem[][]>;

export const AddTaskToTreeUseCase: UseCase<Input, Output> = () => {
	return {
		execute: async ({ tree, task }) => {
			const newTree = tree.flat();
			newTree.push({
				name: task.name,
				id: task.id,
				previousTaskIds: task.previousTaskIds,
				nextTaskIds: task.nextTaskIds
			});
			task.previousTaskIds?.forEach((previousTaskId) => {
				newTree
					?.find((task) => task?.id === previousTaskId)
					?.nextTaskIds?.push(task.id);
			});
			console.debug('tree after add', newTree);
			return UseCaseResponseBuilder.success(200, [newTree]);
		}
	};
};
