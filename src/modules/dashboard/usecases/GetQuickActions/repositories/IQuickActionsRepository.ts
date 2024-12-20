import type { QuestTree } from '../aggregates/QuestTree';
import type { QuestTreeItem } from '../aggregates/QuestTreeItem';

export type GetNextItemInTree = (tree: QuestTree) => QuestTreeItem | undefined;