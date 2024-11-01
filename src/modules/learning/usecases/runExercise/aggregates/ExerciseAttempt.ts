import { z } from 'zod';
import { ExerciseAttemptResultSchema, type ExerciseAttemptResult } from './ExerciseAttemptResult';

export type ExerciseAttempt = ExerciseAttemptResult & {
	taskId: string;
	apprenticeId: string;
	apprenticeSolution: string;
}

export const ExerciseAttemptSchema = z.object({
	taskId: z.string(),
	apprenticeId: z.string(),
	apprenticeSolution: z.string(),
}).merge(ExerciseAttemptResultSchema);