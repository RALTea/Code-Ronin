import type { Language } from '$learning/domain/Language';
import type { ExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
import { FetchApprenticeSolutionError } from '$learning/usecases/runExercise/errors/FetchApprenticeSolutionError';
import { FetchTestCasesError } from '$learning/usecases/runExercise/errors/FetchTestCasesError';
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
import type { AnswerType } from './aggregates/TaskDetails';
import { FetchTaskDetailsError } from './errors/FetchTaskDetailsError';

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
		getTaskDetails: IRunExerciseRepository.FetchTaskDetails;
	}
>;

type Output = OutputFactory<ExerciseAttemptResult>;

export const runExercise: UseCase<Input, Output> = (deps) => {
	const {
		getApprenticeSolution,
		evaluateSolution,
		getTestCases,
		successHandlers,
		failHandlers,
		getTaskDetails
	} = deps;

	const _fetchApprenticeSolution = async (apprenticeId: string) => {
		try {
			return getApprenticeSolution(apprenticeId);
		} catch (error) {
			throw new FetchApprenticeSolutionError(extractError(error));
		}
	};

	const _getTestCases = async (taskId: string) => {
		try {
			return getTestCases(taskId);
		} catch (error) {
			throw new FetchTestCasesError(extractError(error));
		}
	};

	const _getTaskDetails = async (taskId: string) => {
		try {
			return getTaskDetails(taskId);
		} catch (error) {
			throw new FetchTaskDetailsError(extractError(error));
		}
	};

	const _buildCodeToBeEvaluated = (apprenticeSolution: string, testCases: string, taskType: AnswerType) => {
		const builder = CodeBuilder(testCases);
		if (taskType === 'tests') builder.replace('// (@@@*@@@)', apprenticeSolution);
		if (taskType === 'stdout') {
			builder.replace('// (@@@*@@@)', `const studentSolution = () => {\n${apprenticeSolution}\n}`);
		}
		if (taskType === 'stderr') {
			builder.replace('// (@@@*@@@)', `const studentSolution = () => {\n${apprenticeSolution}\n}`);
		}
		return builder
			.removeComments()
			.build();
	}

	return {
		execute: async (data) => {
			const { apprenticeId, language, taskId } = data;

			const apprenticeSolution = await _fetchApprenticeSolution(apprenticeId);
			const testCases = await _getTestCases(taskId);
			const taskDetails = await _getTaskDetails(taskId);

			try {
				const codeToBeEvaluated = _buildCodeToBeEvaluated(apprenticeSolution, testCases, taskDetails.answerType);
				const result: ExerciseAttemptResult = await evaluateSolution(codeToBeEvaluated, language);
				
				const attempt: ExerciseAttempt = {
					apprenticeId,
					taskId,
					apprenticeSolution,
					...result
				};

				// Handle results
				console.log('result', result.message);
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
					await Promise.all(failHandlers.map((handler) => handler(attempt)));
				}

				// Usecase completed; result might either be a success or a failure
				return UseCaseResponseBuilder.success(200, result);
			} catch (error) {
				await Promise.all(failHandlers.map((handler) => handler()));
				throw new FetchApprenticeSolutionError(extractError(error));
			}
		}
	};
};
