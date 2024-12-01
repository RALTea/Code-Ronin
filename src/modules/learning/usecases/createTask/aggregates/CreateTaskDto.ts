import { z } from 'zod';

export const CreateTaskDtoSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	instructions: z.string(),
	exp: z.number(),
	previousTaskId: z.string().optional(),
	nextTaskId: z.string().optional(),
	isMiniboss: z.boolean(),
	validation: z.object({
		expectedStdout: z.string().optional(),
		expectedStderr: z.string().optional(),
		testFileNames: z.array(z.string()).optional(),
		forbiddenSnippets: z.array(z.string()).optional(),
		mandatorySnippets: z.array(z.string()).optional(),
	}),
});

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>;