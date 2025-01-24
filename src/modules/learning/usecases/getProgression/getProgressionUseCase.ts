import type { Task } from '$learning/domain/Task';
import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type { ApprenticeAttempt } from './aggregates/ApprenticeAttempt';
import type { ApprenticeProgression } from './aggregates/ApprenticeProgression';
import * as IProgressionRepository from './repositories/IProgressionRepository';

type Input = InputFactory<
	{
		apprenticeId: string;
		questId: string;
	},
	{
		getUnorderedTasks: IProgressionRepository.GetTasksFromQuest;
		getApprenticeAttemptsOnQuest: IProgressionRepository.GetApprenticeAttemptsOnQuest
	}
>;

type Output = OutputFactory<ApprenticeProgression>;

const sortTasks = (unorderedTasks: Task[]): Task[] => {
	const tasks = [...unorderedTasks];
	const sortedTasks: Task[] = [];
	const taskMap = tasks.reduce((acc, task) => {
		acc[task.id] = task;
		return acc;
	}, {} as Record<string, Task>);

	// Create a set of all nextTaskIds
	const nextTaskIds = new Set(
		tasks
			.map(task => task.nextTaskId)
			.filter(nextTaskId => nextTaskId !== undefined)
	);

	// Find the first task - the one whose id is not in nextTaskIds
	const firstTask = tasks.find(task => !nextTaskIds.has(task.id));
	
	if (!firstTask) {
		throw new Error('No first task found');
	}
	sortedTasks.push(firstTask);
	let hasNext = firstTask.nextTaskId !== undefined;
	let currentTask = firstTask;
	let iterations = 0;

	while(hasNext) {
		const nextTask = taskMap[currentTask.nextTaskId as string];
		sortedTasks.push(nextTask);
		currentTask = nextTask;
		hasNext = nextTask?.nextTaskId !== undefined;
		console.debug({
			currentTask: currentTask.name,
			nextTask: nextTask.nextTaskId
		})
		iterations++;
		if (iterations > unorderedTasks.length) {
			throw new Error('Infinite loop detected');
		}
	}
	return sortedTasks.filter((task) => task !== undefined);
}

export const getProgressionUseCase: UseCase<Input, Output> = (deps) => {
	const { getUnorderedTasks, getApprenticeAttemptsOnQuest } = deps;
	return {
		execute: async (data) => {
			const { apprenticeId, questId } = data;
			let unorderedTasks: Task[] = []
			try {
				unorderedTasks = await getUnorderedTasks(questId);
				console.debug({unorderedTasks})
			} catch (error) {
				console.error("getProgression.getUnorderedTasks Error", error);
			}
			const orderedTasks = sortTasks(unorderedTasks);
			console.debug({orderedTasks})
			let apprenticeAttempts: ApprenticeAttempt[] = [];
			try {
				apprenticeAttempts = await getApprenticeAttemptsOnQuest(apprenticeId, questId);
			} catch (error) {
				console.error("getProgression.getApprenticeAttemptsOnQuest Error", error);
			}

			const result: ApprenticeProgression = {
				tasks: orderedTasks.map((task) => ({
					...task,
					isCompleted: apprenticeAttempts.some((attempt) => attempt.taskId === task.id && attempt.success),
					isLocked: false, // This is updated lower down for better readability
				}))
			}

			// unlock tasks
			result.tasks.forEach((task, index) => {
				if (index === 0) {
					task.isLocked = false;
				} else {
					const previousTask = result.tasks[index - 1];
					task.isLocked = !previousTask.isCompleted;
				}
			});
			return UseCaseResponseBuilder.success(200, result);
		}
	};
};
