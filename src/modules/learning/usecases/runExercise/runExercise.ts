import type { Language } from '$learning/domain/Language';
import { FetchApprenticeSolutionError } from '$learning/errors/FetchApprenticeSolutionError';
import { FetchTestCasesError } from '$learning/errors/FetchTestCasesError';
import type { ExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
import * as IRunExerciseRepository from '$learning/usecases/runExercise/repositories/IRunExerciseRepository';
import { CodeBuilder } from '$learning/usecases/runExercise/services/CodeBuilder';
import { OutputParser } from '$learning/usecases/runExercise/services/OutputParser';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import { extractError } from '$lib/utils/error.utils';
import type { ExerciseAttempt } from './aggregates/ExerciseAttempt';

type Input = InputFactory<
	{
		apprenticeId: string;
		taskId: string;
		language: Language;
	},
	{
		getApprenticeSolution: IRunExerciseRepository.FetchApprenticeSolution;
		getTestCases: IRunExerciseRepository.FetchTestCases;
		evaluateSolution: IRunExerciseRepository.EvaluateSolution;
		successHandlers: IRunExerciseRepository.HandleSuccess[];
		failHandlers: IRunExerciseRepository.HandleFail[];
	}
>;

type Output = OutputFactory<ExerciseAttemptResult>;

export const runExercise: UseCase<Input, Output> = (deps) => {
	const { getApprenticeSolution, evaluateSolution, getTestCases, successHandlers, failHandlers } =
		deps;
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
			let attempt: ExerciseAttempt = {
				apprenticeId,
				taskId,
				apprenticeSolution,
				id: '',
				success: false,
				message: ''
			}
			try {
				const codeToBeEvaluated = CodeBuilder(testCases)
					.replace('// (@@@*@@@)', apprenticeSolution)
					.removeComments()
					.build();
				result = await evaluateSolution(codeToBeEvaluated, language);
				attempt = {
					...attempt,
					...result
				}

				// Handle results
				if (result.success) {
					result.message = OutputParser(result.message ?? '')
						.formatSuccess()
						.get();
					await Promise.all(successHandlers.map((handler) => handler(attempt)));
				}
				if (!result.success) {
					result.message = OutputParser(result.message ?? '')
						.formatError()
						.get();
					await Promise.all(failHandlers);
				}

				// Usecase completed; result might either be a success or a failure
				return UseCaseResponseBuilder.success(200, result);
			} catch (error) {
				throw new FetchApprenticeSolutionError(extractError(error));
			}
		}
	};
};
