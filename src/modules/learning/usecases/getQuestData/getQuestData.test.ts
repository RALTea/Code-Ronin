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
});
