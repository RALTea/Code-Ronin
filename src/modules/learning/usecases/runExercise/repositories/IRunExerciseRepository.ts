import type { Language } from '$learning/domain/Language';
import type { ExerciseAttemptResult } from '../aggregates/ExerciseAttemptResult';

export type FetchApprenticeSolution = (id: string) => Promise<string>;
export type FetchTestCases = (id: string) => Promise<string>;
export type EvaluateSolution = (solution: string, language: Language) => Promise<ExerciseAttemptResult>;