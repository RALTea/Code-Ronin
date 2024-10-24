import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { Apprentice } from '@prisma/client';
import * as IApprenticeRepository from '../repositories/IApprenticeRepository';

type Input = InputFactory<
	{ apprenticeId: string },
	{ fetchApprenticeProfileSummary: IApprenticeRepository.FetchApprenticeProfileSummary }
>;
type Output = OutputFactory<Apprentice>;

export const getApprenticeProfileSummary: UseCase<Input, Output>= (dependencies) => {
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
