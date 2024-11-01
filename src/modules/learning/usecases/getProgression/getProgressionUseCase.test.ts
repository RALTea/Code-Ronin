import type { Task } from '$learning/domain/Task';
import { describe, expect, it, } from 'vitest';
import type { ApprenticeAttempt } from './aggregates/ApprenticeAttempt';
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
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => []
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		const result = useCaseResult.data.tasks.map((it) => ({ id: it.id, nextTaskId: it.nextTaskId }));
		expect(result).toEqual(expectedSortedTasks);
	});

	it('should not include undefined tasks', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: '4' },
		] as Task[];
		const expectedSortedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: '4' },
		] as Task[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => []
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		const result = useCaseResult.data.tasks.map((it) => ({ id: it.id, nextTaskId: it.nextTaskId }));
		expect(result).toEqual(expectedSortedTasks);
	});

	it('should mark tasks with successful attempt as completed', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		const apprenticeAttempts: ApprenticeAttempt[] = [
			{ taskId: "1", success: true, questId: "1" },
		] as ApprenticeAttempt[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => apprenticeAttempts
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		expect(useCaseResult.data.tasks[0].isCompleted).toBe(true);
		expect(useCaseResult.data.tasks[1].isCompleted).toBe(false);
		expect(useCaseResult.data.tasks[2].isCompleted).toBe(false);
	});

	it("should mark tasks as completed even if they's a failed attempt", async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		const apprenticeAttempts: ApprenticeAttempt[] = [
			{ taskId: "1", success: false, questId: "1" },
			{ taskId: "1", success: false, questId: "1" },
			{ taskId: "1", success: true, questId: "1" },
		] as ApprenticeAttempt[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => apprenticeAttempts
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		expect(useCaseResult.data.tasks[0].isCompleted).toBe(true);
		expect(useCaseResult.data.tasks[1].isCompleted).toBe(false);
		expect(useCaseResult.data.tasks[2].isCompleted).toBe(false);
	});

	it('should mark tasks as uncompleted if there\'re only failed attemps', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		const apprenticeAttempts: ApprenticeAttempt[] = [
			{ taskId: "1", success: false, questId: "1" },
			{ taskId: "1", success: false, questId: "1" },
			{ taskId: "1", success: false, questId: "1" },
		] as ApprenticeAttempt[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => apprenticeAttempts
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		expect(useCaseResult.data.tasks[0].isCompleted).toBe(false);
		expect(useCaseResult.data.tasks[1].isCompleted).toBe(false);
		expect(useCaseResult.data.tasks[2].isCompleted).toBe(false);
	});

	it('should mark tasks as locked if previous task is not completed', async () => {
		// Arrange
		const unorderedTasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		const apprenticeAttempts: ApprenticeAttempt[] = [
			{ taskId: "1", success: false, questId: "1" },
			{ taskId: "1", success: true, questId: "1" },
		] as ApprenticeAttempt[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => unorderedTasks,
			getApprenticeAttemptsOnQuest: async () => apprenticeAttempts
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		const result = useCaseResult.data.tasks;
		expect(result[0].isLocked).toBe(false);
		expect(result[1].isLocked).toBe(false);
		expect(result[2].isLocked).toBe(true);
	});

	it('should unlock the first task when no attempts have been made yet', async () => {
		// Arrange
		const tasks: Task[] = [
			{ id: '1', nextTaskId: '2' },
			{ id: '2', nextTaskId: '3' },
			{ id: '3', nextTaskId: undefined },
		] as Task[];

		const apprenticeAttempts: ApprenticeAttempt[] = [] as ApprenticeAttempt[];

		// Act
		const useCaseResult = await getProgressionUseCase({
			getUnorderedTasks: async () => tasks,
			getApprenticeAttemptsOnQuest: async () => apprenticeAttempts
		}).execute({ apprenticeId: '1', questId: '1' });
		if (!useCaseResult.isSuccess) {
			throw new Error('Expected success');
		}

		// Assert
		const result = useCaseResult.data.tasks;
		expect(result[0].isLocked).toBe(false);
		expect(result[1].isLocked).toBe(true);
		expect(result[2].isLocked).toBe(true);
	});
});