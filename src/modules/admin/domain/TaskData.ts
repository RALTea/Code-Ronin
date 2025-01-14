import { z } from 'zod';
import { ValidationDataSchema } from './ValidationData';
import { TestTypeSchema } from './TestType';

export const TaskDataSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	instructions: z.string(),
	exp: z.number(),
	previousTaskIds: z.string().array().optional(),
	nextTaskIds: z.string().array().optional(),
	isMiniboss: z.boolean(),
	testType: TestTypeSchema,
	validation: ValidationDataSchema,
});

export type TaskData = z.infer<typeof TaskDataSchema>;