import type { Language } from '$learning/domain/Language';
import type { ExerciseAttempt } from '../aggregates/ExerciseAttempt';
import type { ExerciseAttemptResult } from '../aggregates/ExerciseAttemptResult';

export type FetchApprenticeSolution = (id: string) => Promise<string>;
export type FetchTestCases = (id: string) => Promise<string>;
export type EvaluateSolution = (solution: string, language: Language) => Promise<ExerciseAttemptResult>;
export type HandleSuccess = (data: ExerciseAttempt) => Promise<void>;
export type HandleFail = (data: ExerciseAttempt) => Promise<void>;