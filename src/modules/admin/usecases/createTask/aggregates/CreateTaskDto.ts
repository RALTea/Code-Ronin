import { z } from 'zod';
import type { TaskTreeItem } from '../../../domain/TaskTreeItem';
import { ValidationDataSchema } from '$admin/domain/ValidationData';

export const CreateTaskDtoSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	instructions: z.string(),
	exp: z.number(),
	previousTaskIds: z.string().array().optional(),
	nextTaskIds: z.string().array().optional(),
	isMiniboss: z.boolean(),
	validation: ValidationDataSchema
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

export const mapCreateTaskDtoToTaskTreeItem = (dto: CreateTaskDto): TaskTreeItem => {
	return {
		id: dto.id,
		name: dto.name,
		nextTaskIds: dto.nextTaskIds || [],
		previousTaskIds: dto.previousTaskIds || []
	};
};
