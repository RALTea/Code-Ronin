import { describe, expect, test } from 'vitest';
import { TasksSorter, type ChainItem } from './TasksSorter';

describe("Unit: TaskSorter", () => {
	test('Should add item to the end of the list', () => {
		const list: ChainItem[] = [{
			id: '1',
		}];
		const sorter = TasksSorter(list);
		sorter.append({ id: '2' });

		expect(list).toEqual([
			{ id: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '1' },
		]);
	});
	test('Should insert item at given position', () => {
		const list: ChainItem[] = [
			{ id: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '1', nextItemId: '3' },
			{ id: '3', previousItemId: '2' },
		];
		const sorter = TasksSorter(list);
		sorter.insert(2, { id: '4' });

		expect(list).toEqual([
			{ id: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '1', nextItemId: '4' },
			{ id: '4', previousItemId: '2', nextItemId: '3' },
			{ id: '3', previousItemId: '4' },
		]);
	});

	test('Should move existing item to given position', () => {
		const list: ChainItem[] = [
			{ id: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '1', nextItemId: '3' },
			{ id: '3', previousItemId: '2', nextItemId: '4' },
			{ id: '4', previousItemId: '3' },
		];
		const sorter = TasksSorter(list);
		sorter.move(1, list[2]);

		expect(list).toEqual([
			{ id: '1', nextItemId: '3' },
			{ id: '3', previousItemId: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '3', nextItemId: '4' },
			{ id: '4', previousItemId: '2' },
		]);
	});

	test('Should move item to the beginning of the list', () => {
		const list: ChainItem[] = [
			{ id: '1', nextItemId: '2' },
			{ id: '2', previousItemId: '1', nextItemId: '3' },
			{ id: '3', previousItemId: '2' },
		];
		const sorter = TasksSorter(list);
		sorter.move(0, list[2]);

		expect(list).toEqual([
			{ id: '3', nextItemId: '1' },
			{ id: '1', previousItemId: '3', nextItemId: '2' },
			{ id: '2', previousItemId: '1' },
		]);
	});
});