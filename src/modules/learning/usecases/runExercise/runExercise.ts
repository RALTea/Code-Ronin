import type { Language } from '$learning/domain/Language';
import type { FormattedExerciseAttemptResult } from '$learning/usecases/runExercise/aggregates/ExerciseAttemptResult';
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

type Output = OutputFactory<FormattedExerciseAttemptResult>;

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

	const _buildCodeToBeEvaluated = (
		apprenticeSolution: string,
		testCases: string,
		taskType: AnswerType
	) => {
		if (apprenticeSolution.includes('// (@@@*@@@)')) {
			throw new Error('Apprentice solution contains illegal string. Remove it, smartass.');
		}
		const builder = CodeBuilder(testCases);
		if (taskType === 'tests') builder.replaceAll('// (@@@*@@@)', apprenticeSolution);
		if (taskType === 'stdout') {
			builder.replaceAll(
				'// (@@@*@@@)',
				`const studentSolution = () => {\n${apprenticeSolution}\n}`
			);
		}
		if (taskType === 'stderr') {
			builder.replaceAll(
				'// (@@@*@@@)',
				`const studentSolution = () => {\n${apprenticeSolution}\n}`
			);
		}
		const commentsToKeep = ['// (@Student_code_start@)', '// (@Student_code_end@)'];
		return builder.removeComments(commentsToKeep).build();
	};

	return {
		execute: async (data) => {
			const { apprenticeId, language, taskId } = data;

			const apprenticeSolution = await _fetchApprenticeSolution(apprenticeId);
			const testCases = await _getTestCases(taskId);
			const taskDetails = await _getTaskDetails(taskId);

			try {
				const codeToBeEvaluated = _buildCodeToBeEvaluated(
					apprenticeSolution,
					testCases,
					taskDetails.answerType
				);
				const rawResult = await evaluateSolution(codeToBeEvaluated, language);

				const result: FormattedExerciseAttemptResult = {
					...rawResult,
					formattedOutput: '',
					debugOutput: ''
				};

				if (language === 'typescript5-vitest') {
					result.formattedOutput = result.output; // output from evaluateSolution is simplified
					result.debugOutput = result.fullOutput ?? ''; // fullOutput from evaluateSolution
					result.output = result.fullOutput ?? ''; // output for the final result is fullOutput
				} else {
					const parser = OutputParser(result.output ?? '');
					if (result.status === 'SUCCESS') {
						result.formattedOutput = parser.formatSuccess();
					} else {
						result.formattedOutput = parser.formatErrors();
					}
					result.debugOutput = parser.formatDebug();
					result.output = parser.cleanUp();
				}

				const attempt: ExerciseAttempt = {
					apprenticeId,
					taskId,
					apprenticeSolution,
					...result
				};

				if (result.status === 'SUCCESS') {
					await Promise.all(successHandlers.map((handler) => handler(attempt)));
				} else {
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
