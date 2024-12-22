import type { Tree } from '../../../aggregates/Tree';
import type { TreeItem } from '../../../aggregates/TreeItem';
import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

export type GetNextItemInTree = (tree: Tree) => TreeItem | undefined;
export type ListTasksCompletedByUserForQuest = (questId: string, userId: string) => Promise<TaskTreeItem[]>;