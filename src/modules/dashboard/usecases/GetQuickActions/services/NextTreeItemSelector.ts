import type { Tree } from '../../../aggregates/Tree';
import * as IQuickActionsRepository from '../repositories/IQuickActionsRepository';

export const NextTreeItemSelector: IQuickActionsRepository.GetNextItemInTree = (
	tree: Tree
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
