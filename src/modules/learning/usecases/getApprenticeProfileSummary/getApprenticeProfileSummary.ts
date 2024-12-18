import type { ApprenticeProfileSummary } from '$learning/usecases/getApprenticeProfileSummary/aggregates/ApprenticeProfileSummary';
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import { ApprenticeNotFoundError } from './errors/ApprenticeNotFoundError';
import * as IProfileSummaryRepository from './repositories/IProfileSummaryRepository';

type Input = InputFactory<
	{ apprenticeId: string },
	{
		fetchApprenticeInfos: IProfileSummaryRepository.FetchApprenticeInfos;
		fetchApprenticeExp: IProfileSummaryRepository.FetchApprenticeExp;
	}
>;
type Output = OutputFactory<ApprenticeProfileSummary>;

export const getApprenticeProfileSummary: UseCase<Input, Output> = (dependencies) => {
	const { fetchApprenticeInfos, fetchApprenticeExp } = dependencies;
	return {
		execute: async (data) => {
			const { apprenticeId } = data;
			try {
				const [infos, exp] = await Promise.all([
					fetchApprenticeInfos(apprenticeId),
					fetchApprenticeExp(apprenticeId)
				]);
				return UseCaseResponseBuilder.success(200, { ...infos, exp });
			} catch (error) {
				if (error instanceof ApprenticeNotFoundError) {
					return UseCaseResponseBuilder.error(404, error.message);
				}
				return UseCaseResponseBuilder.error(500, 'Failed to fetch apprentice profile summary');
			}
		}
	};
};
