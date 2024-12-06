import { z } from 'zod';

export const ExerciseAttemptResultStatusSchema = z.enum(['COMPILE_ERROR', 'TEST_CASES_FAILED', 'SUCCESS'])

export type ExerciseAttemptResultStatus = z.infer<typeof ExerciseAttemptResultStatusSchema>;

export const ExerciseAttemptResultSchema = z.object({
	id: z.string(),
	output: z.string().optional().default(''),
	status: ExerciseAttemptResultStatusSchema,
});

export type ExerciseAttemptResult = z.infer<typeof ExerciseAttemptResultSchema>;

export const FormattedExerciseAttemptResultSchema = ExerciseAttemptResultSchema.extend({
	formattedOutput: z.string().optional().default(''),
});

export type FormattedExerciseAttemptResult = z.infer<typeof FormattedExerciseAttemptResultSchema>;