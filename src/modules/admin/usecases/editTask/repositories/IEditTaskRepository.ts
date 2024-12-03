import type { TaskData } from '$admin/domain/TaskData';
import type { UpdateValidationDto } from '../aggregates/UpdateValidationDto';


export type SaveTaskData = (taskData: Omit<TaskData, "validation">) => Promise<void>;
export type SaveValidation = (taskData: UpdateValidationDto) => Promise<void>;