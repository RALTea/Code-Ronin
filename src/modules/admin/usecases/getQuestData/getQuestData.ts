import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { QuestData } from '../../domain/QuestData';
import * as IQuestRepository from './repositories/IQuestRepository';

type Input = InputFactory<{ questId: string }, { fetchQuestData: IQuestRepository.GetQuestData }>;
type Output = OutputFactory<QuestData>;

export const GetQuestDataUseCase: UseCase<Input, Output> = (deps) => {
	const { fetchQuestData } = deps;

	const _sortLayers = (tasks: QuestData['tasks']): QuestData['tasks'] => {
		// Flatten the input tasks and create a map for quick lookups
		const flatTasks = tasks.flat();
		if (flatTasks.length === 0) return [];
		const taskMap = new Map(flatTasks.map((task) => [task.id, task]));

		// Detect cycles in the dependency graph
		const visited = new Set<string>();
		const recursionStack = new Set<string>();

		function hasCycle(taskId: string): boolean {
			if (recursionStack.has(taskId)) return true;
			if (visited.has(taskId)) return false;

			visited.add(taskId);
			recursionStack.add(taskId);

			const task = taskMap.get(taskId);
			const previousTasks = task?.previousTaskIds || [];

			for (const prevId of previousTasks) {
				if (hasCycle(prevId)) return true;
			}

			recursionStack.delete(taskId);
			return false;
		}

		// Check for cycles
		for (const task of flatTasks) {
			if (hasCycle(task.id)) {
				throw new Error(`Circular dependency detected involving task ${task.id}`);
			}
		}

		// Find tasks with no previous tasks (first layer)
		const firstLayer = flatTasks.filter((task) => !task.previousTaskIds?.length);

		if (firstLayer.length === 0) {
			throw new Error('No starting tasks found (tasks without prerequisites)');
		}

		// Track processed tasks and create result array
		const processedTasks = new Set(firstLayer.map((task) => task.id));
		const layers: QuestData['tasks'] = [firstLayer];

		while (processedTasks.size < flatTasks.length) {
			const currentLayer = layers[layers.length - 1];
			const nextLayerTasks: typeof flatTasks = [];

			// Process each parent task in the current layer
			for (const parentTask of currentLayer) {
				const nextTaskIds = parentTask.nextTaskIds || [];

				// Add tasks in the order specified by nextTaskIds
				for (const nextId of nextTaskIds) {
					const task = taskMap.get(nextId);
					if (!task) continue;

					// Only add if all prerequisites are met
					if (
						task.previousTaskIds?.every((prevId) => processedTasks.has(prevId)) &&
						!processedTasks.has(task.id)
					) {
						nextLayerTasks.push(task);
						processedTasks.add(task.id);
					}
				}
			}

			if (nextLayerTasks.length === 0) {
				// Check for unreachable tasks
				const unreachableTasks = flatTasks.filter((task) => !processedTasks.has(task.id));
				if (unreachableTasks.length > 0) {
					throw new Error(
						`Unreachable tasks detected: ${unreachableTasks.map((t) => t.id).join(', ')}`
					);
				}
				break;
			}

			layers.push(nextLayerTasks);
		}

		return layers;
	};

	return {
		execute: async (data) => {
			const { questId } = data;
			try {
				const questData = await fetchQuestData(questId);
				questData.tasks = _sortLayers(questData.tasks);
				return UseCaseResponseBuilder.success(200, questData);
			} catch (error) {
				console.error(error);
				const message = error instanceof Error ? error.message : 'Unknown error';
				return UseCaseResponseBuilder.error(404, message);
			}
		}
	};
};
