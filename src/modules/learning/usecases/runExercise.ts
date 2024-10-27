import type { ExerciseAttemptResult } from '$learning/aggregates/ExerciseAttemptResult';
import type { Language } from '$learning/domain/Language';
import { FetchApprenticeSolutionError } from '$learning/errors/FetchApprenticeSolutionError';
import { FetchTestCasesError } from '$learning/errors/FetchTestCasesError';
import * as IApprenticeRepository from '$learning/repositories/IApprenticeRepository';
import type { IEvaluationRepository } from '$learning/repositories/IEvaluationReposiotry';
import { CodeBuilder } from '$learning/services/CodeBuilder';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import { extractError } from '$lib/utils/error.utils';

type Input = InputFactory<
	{
		apprenticeId: string;
		taskId: string;
		language: Language;
	},
	{
		getApprenticeSolution: IApprenticeRepository.FetchApprenticeSolution;
		getTestCases: IApprenticeRepository.FetchTestCases;
		evaluateSolution: IEvaluationRepository['evaluateSolution'];
	}
>;

type Output = OutputFactory<ExerciseAttemptResult>;

export const runExercise: UseCase<Input, Output> = (deps) => {
	const { getApprenticeSolution, evaluateSolution, getTestCases } = deps;
	return {
		execute: async (data) => {
			const { apprenticeId, language, taskId } = data;
			let apprenticeSolution;
			try {
				apprenticeSolution = await getApprenticeSolution(apprenticeId);
			} catch (error) {
				throw new FetchApprenticeSolutionError(extractError(error));
			}
			let testCases: string = '';
			try {
				testCases = await getTestCases(taskId);
			} catch (error) {
				throw new FetchTestCasesError(extractError(error));
			}
			let result: ExerciseAttemptResult;
			try {
				const codeToBeEvaluated = CodeBuilder(testCases)
					.replace('// (@@@*@@@)', apprenticeSolution)
					.removeComments()
					.build();
				console.debug('codeToBeEvaluated', codeToBeEvaluated);
				result = await evaluateSolution(codeToBeEvaluated, language);
			} catch (error) {
				throw new FetchApprenticeSolutionError(extractError(error));
			}
			return UseCaseResponseBuilder.success(200, result);
		}
	};
};
