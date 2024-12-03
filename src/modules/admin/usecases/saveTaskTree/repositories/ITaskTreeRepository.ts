import type { TaskTreeItem } from '$admin/domain/TaskTreeItem';

export type UpdateTasks = (tree: TaskTreeItem[]) => Promise<void>;