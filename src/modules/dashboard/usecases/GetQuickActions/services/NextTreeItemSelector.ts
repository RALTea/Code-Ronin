import type { QuestTree } from '../aggregates/QuestTree';
import * as IQuickActionsRepository from '../repositories/IQuickActionsRepository';

export const NextTreeItemSelector: IQuickActionsRepository.GetNextItemInTree = (
	tree: QuestTree
) => {
	for (let i = 0; i < tree.length; i++) {
		for (let j = 0; j < tree[i].length; j++) {
			if (tree[i][j].isLocked === false && tree[i][j].isCompleted === false) {
				return tree[i][j];
			}
		}
	}
	return undefined;
};
