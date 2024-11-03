import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

// export const allTasks = writable<Task[]>([]);
// export const currentTask = writable<Task | undefined>(undefined);

const allTasks: TaskTreeItem[] = $state([]);
const currentTask: (TaskTreeItem | undefined) = $state<TaskTreeItem | undefined>(undefined);

export const TaskStore = {
	allTasks,
	currentTask,
}