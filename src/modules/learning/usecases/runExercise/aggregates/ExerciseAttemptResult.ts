import { z } from 'zod';

export const ExerciseAttemptResultStatusSchema = z.enum(['COMPILE_ERROR', 'TEST_CASES_FAILED', 'SUCCESS'])

export type ExerciseAttemptResultStatus = z.infer<typeof ExerciseAttemptResultStatusSchema>;

export const ExerciseAttemptResultSchema = z.object({
	id: z.string(),
	message: z.string().optional(),
	status: ExerciseAttemptResultStatusSchema,
});

export type ExerciseAttemptResult = z.infer<typeof ExerciseAttemptResultSchema>;