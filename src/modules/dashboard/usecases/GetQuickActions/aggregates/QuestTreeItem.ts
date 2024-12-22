import { z } from 'zod';
import type { TreeItem } from '../../../aggregates/TreeItem';

export const QuestTreeItemSchema = z.object({
	id: z.string().uuid(),
	previousQuestIds: z.string().uuid().array().optional().default([]),
	nextQuestIds: z.string().uuid().array().optional().default([]),
	isLocked: z.boolean().optional().default(false),
	isCompleted: z.boolean().optional().default(false),
});

export type QuestTreeItem = z.infer<typeof QuestTreeItemSchema>;

export const mapQuestTreeItemToTreeItem = (questTreeItem: QuestTreeItem): TreeItem => {
	return {
		id: questTreeItem.id,
		previousItemsIds: questTreeItem.previousQuestIds,
		nextItemsIds: questTreeItem.nextQuestIds,
		isLocked: questTreeItem.isLocked,
		isCompleted: questTreeItem.isCompleted,
	}
}

export const mapTreeItemToQuestTreeItem = (treeItem: TreeItem): QuestTreeItem => {
	return {
		id: treeItem.id,
		previousQuestIds: treeItem.previousItemsIds,
		nextQuestIds: treeItem.nextItemsIds,
		isLocked: treeItem.isLocked,
		isCompleted: treeItem.isCompleted,
	}
}