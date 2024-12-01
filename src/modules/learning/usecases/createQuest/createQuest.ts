import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type { CreateQuestDto } from './aggregates/CreateQuestDto';
import * as IQuestRepository from './repositories/ICreateQuestRepository';

type Input = InputFactory<
	{ data: CreateQuestDto },
	{
		createQuest: IQuestRepository.CreateQuest;
	}
>;

type Output = OutputFactory<void>;

export const createQuest: UseCase<Input, Output> = (dependencies) => {
	const { createQuest } = dependencies;
	return {
		execute: async (data) => {
			const { data: questData } = data;
			await createQuest(questData);
			return UseCaseResponseBuilder.success(201, void 0);
		}
	};
};