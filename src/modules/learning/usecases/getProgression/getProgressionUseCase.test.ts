import type { Task } from '$learning/domain/Task';
import { describe, expect, it } from 'vitest';
import { getProgressionUseCase } from './getProgressionUseCase';

describe('getProgressionUseCase:Unit', () => {
	it('should sort tasks', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '3', nextTaskId: undefined },
			{ id: '2', nextTaskId: '3' },
		] as Task[];
		const expectedSortedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		// Act
		const sortedTasks = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
		}).execute();

		// Assert
		expect(sortedTasks).toEqual(expectedSortedTasks);
	});

	it('should not include undefined tasks', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', name: 'Task 1', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '2' },
			{ id: '2', name: 'Task 2', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '3' },
			{ id: '3', name: 'Task 3', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '4' },
		] as Task[];
		const expectedSortedTasks: Task[] = [
			{ id: '1', name: 'Task 1', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '2' },
			{ id: '2', name: 'Task 2', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '3' },
			{ id: '3', name: 'Task 3', exp: 1, instructions: "#Do Something", isMiniboss: false, nextTaskId: '4' },
		] as Task[];

		// Act
		const sortedTasks = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
		}).execute();

		// Assert
		expect(sortedTasks).toEqual(expectedSortedTasks);
	});
});