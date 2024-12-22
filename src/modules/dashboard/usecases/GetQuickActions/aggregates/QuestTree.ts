import { z } from 'zod';
import type { Tree } from '../../../aggregates/Tree';
import { mapQuestTreeItemToTreeItem, QuestTreeItemSchema } from './QuestTreeItem';

export const QuestTreeSchema = QuestTreeItemSchema.array().array();

export type QuestTree = z.infer<typeof QuestTreeSchema>;

export const mapQuestTree = (questTree: QuestTree): Tree => {
	return questTree.map((questBloc) => [...questBloc.map(mapQuestTreeItemToTreeItem)]);
};
