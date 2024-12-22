import type { TreeItem } from '$dashboard/aggregates/TreeItem';
import { z } from 'zod';
import type { QuestTreeItem } from './QuestTreeItem';

export const TaskTreeItemSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	previousTaskIds: z.string().uuid().array().optional().default([]),
	nextTaskIds: z.string().uuid().array().optional().default([]),
	isLocked: z.boolean().optional().default(false),
	isCompleted: z.boolean().optional().default(false),
});

export type TaskTreeItem = z.infer<typeof TaskTreeItemSchema>;

export const mapTaskTreeItemToTreeItem = (questTreeItem: TaskTreeItem): TreeItem => {
	return {
		id: questTreeItem.id,
		previousItemsIds: questTreeItem.previousTaskIds,
		nextItemsIds: questTreeItem.nextTaskIds,
		isLocked: questTreeItem.isLocked,
		isCompleted: questTreeItem.isCompleted,
	}
}

export const mapTreeItemToTaskTreeItem = (treeItem: TreeItem): QuestTreeItem => {
	return {
		id: treeItem.id,
		previousQuestIds: treeItem.previousItemsIds,
		nextQuestIds: treeItem.nextItemsIds,
		isLocked: treeItem.isLocked,
		isCompleted: treeItem.isCompleted,
	}
}