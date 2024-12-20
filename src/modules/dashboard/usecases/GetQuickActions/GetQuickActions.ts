import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { QuestTree } from './aggregates/QuestTree';
import type { QuickActions } from './aggregates/QuickActions';
import * as QuickActionsRepository from './repositories/IQuickActionsRepository';

type Input = InputFactory<
	{
		tree: QuestTree;
	},
	{
		getNextItemInTree: QuickActionsRepository.GetNextItemInTree;
	}
>;
type Output = OutputFactory<QuickActions>;

export const GetQuickActionsUseCase: UseCase<Input, Output> = (deps) => {
	const { getNextItemInTree } = deps;
	return {
		execute: async ({ tree }) => {
			const item = getNextItemInTree(tree);
			const nextItemLink = `/campaigns/${item?.id}`;
			return UseCaseResponseBuilder.success(200, {
				nextItemLink
			});
		}
	};
};
