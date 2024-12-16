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

	constructor(loadQuests: Promise<QuestTree>) {
		loadQuests
			.then((quests) => {
				this.quests = quests;
				this.setNbOfColumns(quests);
				this.setNbOfRows(quests);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
