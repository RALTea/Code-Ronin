import type { Task } from '$learning/domain/Task';

export type ITaskRepository = {
	getTaskById: (taskId: string) => Promise<Task>,
}