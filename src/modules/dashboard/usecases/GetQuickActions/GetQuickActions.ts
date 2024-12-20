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
		campaignSlug: string;
	},
	{
		getNextItemInTree: QuickActionsRepository.GetNextItemInTree;
	}
>;
type Output = OutputFactory<QuickActions>;

export const GetQuickActionsUseCase: UseCase<Input, Output> = (deps) => {
	const { getNextItemInTree } = deps;
	return {
		execute: async ({ tree, campaignSlug }) => {
			const item = getNextItemInTree(tree);
			if (!item) {
				return UseCaseResponseBuilder.error(404, 'No more items to complete');
			}
			const nextItemLink = `/campaigns/${campaignSlug}/${item?.id}`;
			return UseCaseResponseBuilder.success(200, {
				nextItemLink
			});
		}
	};
};
