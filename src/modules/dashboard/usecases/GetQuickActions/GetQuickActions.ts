import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { TreeItem } from '../../aggregates/TreeItem';
import { sortLayers } from '../../services/TreeService';
import { mapQuestTree, type QuestTree } from './aggregates/QuestTree';
import type { QuickActions } from './aggregates/QuickActions';
import { mapTaskTree } from './aggregates/TaskTree';
import type { TaskTreeItem } from './aggregates/TaskTreeItem';
import * as QuickActionsRepository from './repositories/IQuickActionsRepository';

type Input = InputFactory<
	{
		tree: QuestTree;
		campaignSlug: string;
		userId: string;
	},
	{
		getNextItemInTree: QuickActionsRepository.GetNextItemInTree;
		listTasksCompletedByUserForQuest: QuickActionsRepository.ListTasksCompletedByUserForQuest;
	}
>;
type Output = OutputFactory<QuickActions>;

export const GetQuickActionsUseCase: UseCase<Input, Output> = (deps) => {
	const { getNextItemInTree, listTasksCompletedByUserForQuest } = deps;
	return {
		execute: async ({ tree, campaignSlug, userId }) => {
			const nextQuest: TreeItem | undefined = getNextItemInTree(mapQuestTree(tree));
			console.debug('GetQuickActionsUseCase', { nextQuest });

			if (!nextQuest) {
				return UseCaseResponseBuilder.error(404, 'No more items to complete');
			}

			const tasks: TaskTreeItem[] = await listTasksCompletedByUserForQuest(nextQuest.id, userId);
			const flatTaskTree = [tasks];
			const taskTree = sortLayers(flatTaskTree, 'previousTaskIds', 'nextTaskIds');
			const nextTask = getNextItemInTree(mapTaskTree(taskTree));

			let nextItemLink = `/campaigns/${campaignSlug}/${nextQuest.id}`;
			if (nextTask) {
				nextItemLink = `/campaigns/${campaignSlug}/${nextQuest.id}/${nextTask.id}`;
			}

			return UseCaseResponseBuilder.success(200, {
				nextItemLink
			});
		}
	};
};
