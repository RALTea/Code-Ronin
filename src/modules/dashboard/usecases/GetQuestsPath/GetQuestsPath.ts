import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';
import type { Quest } from './aggregates/Quest';
import type { QuestTree, QuestTreeItem } from './aggregates/QuestTree';
import { QuestHasNoTasksError } from './errors/QuestHasNoTasksError';
import * as IGetQuestsPathRepository from './repositories/IGetQuestsPathRepository';

type Input = InputFactory<
	{
		campaignName: string;
		userId: string;
	},
	{
		listCampaignQuests: IGetQuestsPathRepository.ListQuestsFromCampaign;
		listCompletedQuestsForCampaign: IGetQuestsPathRepository.ListCompletedQuestsForCampaign;
	}
>;

type Output = OutputFactory<QuestTree>;

export const GetQuestsPathUseCase: UseCase<Input, Output> = (deps) => {
	const { listCampaignQuests, listCompletedQuestsForCampaign } = deps;
	return {
		execute: async (input) => {
			const { campaignName, userId } = input;
			const quests = await listCampaignQuests(campaignName);
			const completedQuests = await listCompletedQuestsForCampaign(campaignName, userId);
			const questTreeItems: QuestTreeItem[] = quests.map((quest) => ({
				...quest,
				isCompleted: completedQuests.some((completedQuest) => completedQuest.id === quest.id)
			}));
			try {
				const sortedQuests = _sortLayers([questTreeItems]);
				return UseCaseResponseBuilder.success(200, sortedQuests);
			} catch (error) {
				if (error instanceof QuestHasNoTasksError) {
					return UseCaseResponseBuilder.error(400, new QuestHasNoTasksError(campaignName).message);
				}
				console.error('Error sorting quests', error);
				return UseCaseResponseBuilder.error(500, 'Error sorting quests');
			}
		}
	};
};

const _sortLayers = <T extends Quest>(quests: T[][]): T[][] => {
	// Flatten the input quests and create a map for quick lookups
	const flatQuests = quests.flat();
	const questMap = new Map(flatQuests.map((quest) => [quest.id, quest]));

	// Detect cycles in the dependency graph
	const visited = new Set<string>();
	const recursionStack = new Set<string>();

	function hasCycle(questId: string): boolean {
		if (recursionStack.has(questId)) return true;
		if (visited.has(questId)) return false;

		visited.add(questId);
		recursionStack.add(questId);

		const quest = questMap.get(questId);
		const previousQuests = quest?.previousQuestIds || [];

		for (const prevId of previousQuests) {
			if (hasCycle(prevId)) return true;
		}

		recursionStack.delete(questId);
		return false;
	}

	// Check for cycles
	for (const quest of flatQuests) {
		if (hasCycle(quest.id)) {
			throw new Error(`Circular dependency detected involving quest ${quest.id}`);
		}
	}

	// Find quests with no previous quests (first layer)
	const firstLayer = flatQuests.filter((quest) => !quest.previousQuestIds?.length);

	if (firstLayer.length === 0) {
		throw new QuestHasNoTasksError()
	}

	// Track processed quests and create result array
	const processedQuests = new Set(firstLayer.map((quest) => quest.id));
	const layers: T[][] = [firstLayer];

	while (processedQuests.size < flatQuests.length) {
		const currentLayer = layers[layers.length - 1];
		const nextLayerQuests: typeof flatQuests = [];

		// Process each parent quest in the current layer
		for (const parentTask of currentLayer) {
			const nextTaskIds = parentTask.nextQuestIds || [];

			// Add quests in the order specified by nextTaskIds
			for (const nextId of nextTaskIds) {
				const quest = questMap.get(nextId);
				if (!quest) continue;

				// Only add if all prerequisites are met
				if (
					quest.previousQuestIds?.every((prevId) => processedQuests.has(prevId)) &&
					!processedQuests.has(quest.id)
				) {
					nextLayerQuests.push(quest);
					processedQuests.add(quest.id);
				}
			}
		}

		if (nextLayerQuests.length === 0) {
			// Check for unreachable quests
			const unreachableQuests = flatQuests.filter((quest) => !processedQuests.has(quest.id));
			if (unreachableQuests.length > 0) {
				throw new Error(
					`Unreachable quests detected: ${unreachableQuests.map((t) => t.id).join(', ')}`
				);
			}
			break;
		}

		layers.push(nextLayerQuests);
	}

	return layers;
};
