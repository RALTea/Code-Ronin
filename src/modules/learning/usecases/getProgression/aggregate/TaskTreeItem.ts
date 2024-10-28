import type { Task } from '$learning/domain/Task';

export type TaskTreeItem = Task & {
	isLocked: boolean;
	isCompleted: boolean;
};
