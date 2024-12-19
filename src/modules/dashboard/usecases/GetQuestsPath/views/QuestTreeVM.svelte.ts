import type { QuestTree } from '../aggregates/QuestTree';

export class QuestTreeVM {
	isLoading: boolean = $state(true);
	quests: QuestTree | undefined = $state(undefined);
	nbOfColumns: number = $state(0);
	nbOfRows: number = $state(0);

	private setNbOfColumns(quests: QuestTree) {
		this.nbOfColumns = quests.length;
	}
	private setNbOfRows(quests: QuestTree) {
		this.nbOfRows = quests.reduce((maxDepth, quest) => {
			const depth = quest.length;
			return depth > maxDepth ? depth : maxDepth;
		}, 0);
	}

	updateLoadQuests(loadQuests: Promise<QuestTree>) {
		loadQuests
			.then((quests) => {
				this.quests ??= [];
				this.quests.length = 0;
				this.quests?.push(...quests);
				this.setNbOfColumns(quests);
				this.setNbOfRows(quests);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	constructor(loadQuests: Promise<QuestTree>) {
		console.debug('QuestTreeVM.constructor');
		loadQuests
			.then((quests) => {
				this.quests ??= [];
				this.quests?.push(...quests);
				this.setNbOfColumns(quests);
				this.setNbOfRows(quests);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
