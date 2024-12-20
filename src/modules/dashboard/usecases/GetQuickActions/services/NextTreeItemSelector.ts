import type { QuestTree } from '../aggregates/QuestTree';
import * as IQuickActionsRepository from '../repositories/IQuickActionsRepository';

export const NextTreeItemSelector: IQuickActionsRepository.GetNextItemInTree = (
	tree: QuestTree
) => {
	for (let i = 0; i < tree.length; i++) {
		console.debug('NextTreeItemSelector tree', tree[i].length);
		for (let j = 0; j < tree[i].length; j++) {
			console.debug('NextTreeItemSelector testing', tree[i][j]);
			if (tree[i][j].isLocked === false) {
				console.debug('NextTreeItemSelector returning', tree[i][j]);
				return tree[i][j];
			}
		}
	}
	console.debug('NextTreeItemSelector returning', undefined);
	return undefined;
};
