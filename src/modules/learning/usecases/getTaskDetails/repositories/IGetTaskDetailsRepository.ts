import type { TaskDetails } from '../aggregates/TaskDetails';

export type GetTaskDetails = (taskId: string, apprenticeId: string) => Promise<TaskDetails>;