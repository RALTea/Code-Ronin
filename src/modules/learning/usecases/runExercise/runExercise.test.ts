import type { TaskDetails } from './aggregates/TaskDetails';
import { runExercise } from './runExercise';
import { describe, it, expect, vi } from 'vitest';

describe('runExercise', () => {
	it('Should call fail handlers when the solution is not valid', async () => {
		const taskDetails: TaskDetails = {
			answerType: 'tests'
		}
		const failHandlers = [vi.fn()];
		await runExercise({
			evaluateSolution: vi.fn(() => Promise.resolve({
				id: '1',
				success: false,
				message: 'Message'
			})),
			failHandlers,
			getApprenticeSolution: vi.fn(() => Promise.resolve('Solution')),
			getTestCases: vi.fn(() => Promise.resolve('TestCases')),
			getTaskDetails: vi.fn(() => Promise.resolve(taskDetails)),
			successHandlers: []
		}).execute({
			apprenticeId: '1',
			language: 'typescript5-vitest',
			taskId: '1'
		});

		expect(failHandlers[0]).toHaveBeenCalled();
	})
})
