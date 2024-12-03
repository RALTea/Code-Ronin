import type { TaskData } from '../../../domain/TaskData';

export type GetTaskData = (taskId: string) => Promise<TaskData>;