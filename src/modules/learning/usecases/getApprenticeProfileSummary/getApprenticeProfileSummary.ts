import type { ApprenticeProfileSummary } from '$learning/usecases/getApprenticeProfileSummary/aggregates/ApprenticeProfileSummary';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import * as IProfileSummaryRepository from './repositories/IProfileSummaryRepository';

type Input = InputFactory<
	{ apprenticeId: string },
	{ fetchApprenticeProfileSummary: IProfileSummaryRepository.FetchApprenticeProfileSummary }
>;
type Output = OutputFactory<ApprenticeProfileSummary>;

export const getApprenticeProfileSummary: UseCase<Input, Output> = (dependencies) => {
	const { fetchApprenticeProfileSummary } = dependencies;
	return {
		execute: async (data) => {
			const { apprenticeId } = data;
			try {
				const apprenticeSummary = await fetchApprenticeProfileSummary(apprenticeId);
				return UseCaseResponseBuilder.success(200, apprenticeSummary);
			} catch {
				return UseCaseResponseBuilder.error(500, 'Failed to fetch apprentice profile summary');
			}
		}
	};
};
