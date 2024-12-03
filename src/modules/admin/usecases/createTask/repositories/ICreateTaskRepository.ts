import type { CreateTaskDto } from '../aggregates/CreateTaskDto';

export type saveTask = (task: CreateTaskDto & { questId: string; order?: number }) => Promise<void>;
