import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { QuestData } from './aggregates/QuestData';
import * as IQuestRepository from './repositories/IQuestRepository';

type Input = InputFactory<{ questId: string }, { fetchQuestData: IQuestRepository.GetQuestData }>;

type Output = OutputFactory<QuestData>;

export const GetQuestDataUseCase: UseCase<Input, Output> = (deps) => {
	const { fetchQuestData } = deps;

	const _sortLayers = (tasks: QuestData['tasks']): QuestData['tasks'] => {
		// Flatten the input tasks (in case they come in multiple layers)
		const flatTasks = tasks.flat();
		
		// Find tasks with no previous tasks (first layer)
		const firstLayer = flatTasks.filter(
			(task) => task.previousTaskIds === undefined || task.previousTaskIds?.length === 0
		);
		
		// If no first layer found, return the original tasks
		if (firstLayer.length === 0) return tasks;
		
		// Track processed tasks and layers
		const processedTasks = new Set(firstLayer.map(task => task.id));
		const layers = [firstLayer];
		
		// Continue creating layers until all tasks are processed
		while (processedTasks.size < flatTasks.length) {
			// Find tasks that can be added to the next layer
			const nextLayer = flatTasks.filter(task => 
				// Task not already processed
				!processedTasks.has(task.id) && 
				// All previous tasks have been processed
				task.previousTaskIds?.every(prevId => processedTasks.has(prevId))
			);
			
			// If no tasks can be added to the next layer, break to prevent infinite loop
			if (nextLayer.length === 0) break;
			
			// Add tasks to the current layer and mark as processed
			layers.push(nextLayer);
			nextLayer.forEach(task => processedTasks.add(task.id));
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
				let message = 'Unknown error';
				if (error instanceof Error) {
					message = error.message;
				}
				return UseCaseResponseBuilder.error(404, message);
			}
		}
	};
};
