import type { Task } from '$learning/domain/Task';

// export const allTasks = writable<Task[]>([]);
// export const currentTask = writable<Task | undefined>(undefined);

const allTasks: Task[] = $state([]);
const currentTask: (Task | undefined) = $state<Task | undefined>(undefined);

export const TaskStore = {
	allTasks,
	currentTask,
}