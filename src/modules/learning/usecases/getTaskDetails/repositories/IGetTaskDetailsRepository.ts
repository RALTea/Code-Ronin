import type { TaskDetails } from '../aggregates/TaskDetails';

export type GetTaskDetails = (id: string) => Promise<TaskDetails>;