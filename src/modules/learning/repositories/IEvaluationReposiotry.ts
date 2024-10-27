import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
import type { Language } from '$learning/domain/Language';

export type IEvaluationRepository = {
	evaluateSolution: (solution: string, language: Language) => Promise<ExerciseAttemptResult>;
};
