import type { Task } from '$learning/domain/Task';
import type { InputFactory, UseCase } from '$lib/interfaces/UseCase';

type Input = InputFactory<
	void,
	{
		getUnorderedTasks: () => Promise<Task[]>;
	}
>;

type Output = Task[];

const sortTasks = (unorderedTasks: Task[]): Task[] => {
	const tasks = [...unorderedTasks];
	const sortedTasks: Task[] = [];
	const taskMap = tasks.reduce((acc, task) => {
		acc[task.id] = task;
		return acc;
	}, {} as Record<string, Task>);

	const firstTask = tasks.find((task) => task.previousTaskId === undefined);
	
	if (!firstTask) {
		throw new Error('No first task found');
	}
	sortedTasks.push(firstTask);
	let hasNext = firstTask.nextTaskId !== undefined;
	let previousTask = firstTask;
	let iterations = 0;

	while(hasNext) {
		const nextTask = taskMap[previousTask.nextTaskId as string];
		sortedTasks.push(nextTask);
		previousTask = nextTask;
		hasNext = nextTask?.nextTaskId !== undefined;
		iterations++;
		if (iterations > unorderedTasks.length) {
			throw new Error('Infinite loop detected');
		}
	}

	return sortedTasks.filter((task) => task !== undefined);
}

export const getProgressionUseCase: UseCase<Input, Output> = (deps) => {
	const { getUnorderedTasks } = deps;
	return {
		execute: async () => {
			const unorderedTasks = await getUnorderedTasks();
			const orderedTasks = sortTasks(unorderedTasks);
			return orderedTasks;
		}
	};
};
