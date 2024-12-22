import type { z } from 'zod';
import { mapTaskTreeItemToTreeItem, TaskTreeItemSchema } from './TaskTreeItem';
import type { Tree } from '$dashboard/aggregates/Tree';

export const TaskTreeSchema = TaskTreeItemSchema.array().array();

export type TaskTree = z.infer<typeof TaskTreeSchema>;

export const mapTaskTree = (questTree: TaskTree): Tree => {
	return questTree.map((questBloc) => [...questBloc.map(mapTaskTreeItemToTreeItem)]);
};
