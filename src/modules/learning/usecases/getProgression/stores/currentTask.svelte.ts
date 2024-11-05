import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

// export const allTasks = writable<Task[]>([]);
// export const currentTask = writable<Task | undefined>(undefined);

const allTasks: (TaskTreeItem | undefined)[] = $state([undefined]);
const currentTask: (TaskTreeItem | undefined) = $state<TaskTreeItem | undefined>(undefined);

export const TaskStore = {
	allTasks,
	currentTask,
};
