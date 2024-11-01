import { z } from 'zod';

export type ExerciseAttemptResult = {
	id: string;
	message?: string;
	success: boolean;
};

export const ExerciseAttemptResultSchema = z.object({
	id: z.string(),
	message: z.string().optional(),
	success: z.boolean()
});
