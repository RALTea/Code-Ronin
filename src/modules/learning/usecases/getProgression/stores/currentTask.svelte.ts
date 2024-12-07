import type { TaskTreeItem } from '../aggregates/TaskTreeItem';

// export const allTasks = writable<Task[]>([]);
// export const currentTask = writable<Task | undefined>(undefined);

class CurrentTaskStore {
	allTasks: (TaskTreeItem | undefined)[] = $state([undefined]);
	currentTask: TaskTreeItem | undefined = $state<TaskTreeItem | undefined>(undefined);

	set current(task: TaskTreeItem | undefined) {
		this.currentTask = task;
	}

	get all() {
		return this.allTasks;
	}
}

// const allTasks: (TaskTreeItem | undefined)[] = $state([undefined]);
// const currentTask: TaskTreeItem | undefined = $state<TaskTreeItem | undefined>(undefined);

// export const TaskStore = {
// 	allTasks,
// 	currentTask
// };

export const TaskStore = new CurrentTaskStore();