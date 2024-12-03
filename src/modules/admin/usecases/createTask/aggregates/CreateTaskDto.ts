import { z } from 'zod';
import type { TaskTreeItem } from '../../../domain/TaskTreeItem';

export const CreateTaskDtoSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	instructions: z.string(),
	exp: z.number(),
	previousTaskIds: z.string().array().optional(),
	nextTaskIds: z.string().array().optional(),
	isMiniboss: z.boolean(),
	validation: z.object({
		expectedStdout: z.string().optional(),
		expectedStderr: z.string().optional(),
		testFileName: z.string().optional(),
		forbiddenSnippets: z.array(z.string()).optional(),
		mandatorySnippets: z.array(z.string()).optional(),
	}),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;

export const mapCreateTaskDtoToTaskTreeItem = (dto: CreateTaskDto): TaskTreeItem => {
	return {	
		id: dto.id,
		name: dto.name,
		nextTaskIds: dto.nextTaskIds || [],
		previousTaskIds: dto.previousTaskIds || [],
	}
};