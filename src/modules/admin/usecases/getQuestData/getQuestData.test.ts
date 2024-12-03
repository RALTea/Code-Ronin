import { test, describe, expect, vi } from 'vitest';
import { GetQuestDataUseCase } from './getQuestData';
import type { GetQuestData } from './repositories/IQuestRepository';

describe('Unit: GetQuestData', () => {
	test('should sort tasks by layer', async () => {
		const fetchQuestData: GetQuestData = vi.fn().mockResolvedValueOnce({
			id: '1',
			name: 'testquest',
			tasks: [
				[
					{ name: 'task1', id: '1', nextTaskIds: ['2', '3'] },
					{ name: 'task2', id: '2', previousTaskIds: ['1'] },
					{ name: 'task3', id: '3', previousTaskIds: ['1'] }
				]
			]
		});
		const getQuestDataUseCase = await GetQuestDataUseCase({
			fetchQuestData
		}).execute({ questId: '1' });

		expect(getQuestDataUseCase.isSuccess).toBe(true);
		if (!getQuestDataUseCase.isSuccess) return;
		expect(getQuestDataUseCase.data.tasks).toEqual([
			[{ name: 'task1', id: '1', nextTaskIds: ['2', '3'] }],
			[
				{ name: 'task2', id: '2', previousTaskIds: ['1'] },
				{ name: 'task3', id: '3', previousTaskIds: ['1'] }
			]
		]);
	});
	test('should group tasks in layer by previous task', async () => {
		const fetchQuestData: GetQuestData = vi.fn().mockResolvedValueOnce({
			id: '1',
			name: 'testquest',
			tasks: [
				[
					{ name: 'task1', id: '1', previousTaskIds: [], nextTaskIds: ['2', '3'] },
					{ name: 'task2', id: '2', previousTaskIds: ['1'], nextTaskIds: ['4', '5', '8'] },
					{ name: 'task3', id: '3', previousTaskIds: ['1'], nextTaskIds: ['6', '7'] },
					{ name: 'task4', id: '4', previousTaskIds: ['2'], nextTaskIds: [] },
					{ name: 'task5', id: '5', previousTaskIds: ['2'], nextTaskIds: [] },
					{ name: 'task6', id: '6', previousTaskIds: ['3'], nextTaskIds: [] },
					{ name: 'task7', id: '7', previousTaskIds: ['3'], nextTaskIds: [] },
					{ name: 'task8', id: '8', previousTaskIds: ['2'], nextTaskIds: [] }
				]
			]
		});
		const getQuestDataUseCase = await GetQuestDataUseCase({
			fetchQuestData
		}).execute({ questId: '1' });

		expect(getQuestDataUseCase.isSuccess).toBe(true);
		if (!getQuestDataUseCase.isSuccess) return;
		expect(getQuestDataUseCase.data.tasks).toEqual([
			[{ name: 'task1', id: '1', previousTaskIds: [], nextTaskIds: ['2', '3'] }],
			[
				{ name: 'task2', id: '2', previousTaskIds: ['1'], nextTaskIds: ['4', '5', '8'] },
				{ name: 'task3', id: '3', previousTaskIds: ['1'], nextTaskIds: ['6', '7'] }
			],
			[
				{ name: 'task4', id: '4', previousTaskIds: ['2'], nextTaskIds: [] }, // group 1
				{ name: 'task5', id: '5', previousTaskIds: ['2'], nextTaskIds: [] }, // group 1
				{ name: 'task8', id: '8', previousTaskIds: ['2'], nextTaskIds: [] }, // group 1
				{ name: 'task6', id: '6', previousTaskIds: ['3'], nextTaskIds: [] }, // group 2
				{ name: 'task7', id: '7', previousTaskIds: ['3'], nextTaskIds: [] } // group 2
			]
		]);
	});
});
