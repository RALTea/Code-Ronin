import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
import type { Language } from '$learning/domain/Language';
import { FetchApprenticeSolutionError } from '$learning/errors/FetchApprenticeSolutionError';
import type { IEvaluationRepository } from '$learning/repositories/IEvaluationReposiotry';
import { extractError } from '$lib/utils/error.utils';

type Input = {
	data: {
		apprenticeId: string;
		language: Language;
	};
	deps: {
		fetchApprenticeSolution: (id: string) => Promise<string>;
		evaluateSolution: IEvaluationRepository['evaluateSolution'];
	};
};
export const runExercise = ({ data, deps }: Input) => {
	const { apprenticeId, language } = data;
	const { fetchApprenticeSolution, evaluateSolution } = deps;
	return {
		execute: async () => {
			let apprenticeSolution;
			try {
				apprenticeSolution = await fetchApprenticeSolution(apprenticeId);
			} catch (error) {
				throw new FetchApprenticeSolutionError(extractError(error));
			}
			let result: ExerciseAttemptResult;
			try {
				result = await evaluateSolution(apprenticeSolution, language);
			} catch (error) {
				throw new FetchApprenticeSolutionError(extractError(error));
			}
			return result;
		}
	};
};
