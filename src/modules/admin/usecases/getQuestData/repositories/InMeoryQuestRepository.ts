import * as IQuestRepository from './IQuestRepository';

type _InMemoryQuestRepository = {
	getQuestData: IQuestRepository.GetQuestData;
};

export const InMemoryQuestRepository = (): _InMemoryQuestRepository => {
	return {
		getQuestData: async () => {
			const UUIDs = Array.from({ length: 10 }, () => crypto.randomUUID());
			return {
				id: UUIDs[0],
				name: 'In Memory Quest',
				tasks: [
					[
						{ name: 'In Memory Task 1, Layer 1', id: UUIDs[1], nextTaskIds: [UUIDs[2], UUIDs[3]] },
						{ name: 'In Memory Task 2, Layer 2', id: UUIDs[2], previousTaskIds: [UUIDs[1]], nextTaskIds: [UUIDs[4], UUIDs[5]] },
						{ name: 'In Memory Task 3, Layer 2', id: UUIDs[3], previousTaskIds: [UUIDs[1]], nextTaskIds: [UUIDs[6], UUIDs[7]] },
						{ name: 'In Memory Task 4, Layer 3', id: UUIDs[4], previousTaskIds: [UUIDs[2]], nextTaskIds: [] },
						{ name: 'In Memory Task 5, Layer 3', id: UUIDs[5], previousTaskIds: [UUIDs[2]], nextTaskIds: [] },
						{ name: 'In Memory Task 6, Layer 3', id: UUIDs[6], previousTaskIds: [UUIDs[3]], nextTaskIds: [] },
						{ name: 'In Memory Task 7, Layer 3', id: UUIDs[7], previousTaskIds: [UUIDs[3]], nextTaskIds: [] },
					]
				]
			}
		}
	}
};