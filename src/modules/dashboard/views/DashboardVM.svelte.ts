import type { QuestTree } from '$dashboard/usecases/GetQuestsPath/aggregates/QuestTree';
import { GetQuestsPathUseCase } from '$dashboard/usecases/GetQuestsPath/GetQuestsPath';
import type { CampaignInfos } from '$dashboard/usecases/ListCampaigns/aggregates/CampaignInfos';
import type { DashboardCampaignItem } from '$dashboard/usecases/ListCampaigns/aggregates/DashboardCampaignItem';
import { trpc } from '$lib/clients/trpc';
import { AppNotificationService } from '$notifications/services/AppNotificationService';
import type { TRPCClientInit } from 'trpc-sveltekit';
import type { QuestTree as QuickActionsQuestTree } from '$dashboard/usecases/GetQuickActions/aggregates/QuestTree';
import { browser } from '$app/environment';
import type { AttemptsByCampaign } from '$dashboard/usecases/ListCampaigns/aggregates/AttemptByCampaign';
import { ListCampaignsUseCase } from '$dashboard/usecases/ListCampaigns/ListCampaigns';

export class DashboardVM {
	private getQuestsPathUseCase;
	selectedCampaign: CampaignInfos | undefined = $state(undefined);
	loadQuests: Promise<QuestTree> | undefined = $state(undefined);
	quickActionsTree: Promise<QuickActionsQuestTree> | undefined = $state(undefined);
	fetchCampaigns: Promise<DashboardCampaignItem[]> = $state(new Promise(() => []));

	onCampaignSelected = (campaign: CampaignInfos) => {
		this.selectedCampaign = campaign;
		this.loadQuests = this.getQuestsPathUseCase
			.execute({
				campaignName: this.selectedCampaign?.name,
				userId: '-1'
			})
			.then((ucResult) => {
				if (ucResult.isSuccess) {
					return ucResult.data;
				}
				AppNotificationService.send({ message: ucResult.message, type: 'ERROR' });
				return [];
			});
		this.quickActionsTree = this.loadQuests.then((tree) => {
			return tree.map((questBloc) => [
				...questBloc.map((quest) => ({
					...quest,
					nextQuestIds: quest.nextQuestIds || [],
					previousQuestIds: quest.previousQuestIds || []
				}))
			]);
		});
	};

	constructor(
		init: TRPCClientInit,
		fetchCampaigns: Promise<DashboardCampaignItem[]>,
		anonymousSession: boolean
	) {
		if (anonymousSession) {
			this.fetchCampaigns = this.fetchCampaignsClientSide(init)
			this.fetchCampaigns.then((campaigns) => {
				if (campaigns.length > 0) this.onCampaignSelected(campaigns[0]);
			});
		} else {
			this.fetchCampaigns = fetchCampaigns;
		}
		fetchCampaigns.then((campaigns) => {
			if (campaigns.length > 0) this.onCampaignSelected(campaigns[0]);
		});

		this.getQuestsPathUseCase = GetQuestsPathUseCase({
			listCampaignQuests: (campaignName) =>
				trpc(init)
					.dashboard.getQuestsPath.listQuestsFromCampaign.query({ campaignName })
					.catch(() => {
						return [];
					}),
			listCompletedQuestsForCampaign: (campaignName) =>
				trpc(init)
					.dashboard.getQuestsPath.listCompletedQuestsForCampaign.query({
						campaignName
					})
					.catch(() => {
						return [];
					})
		});
	}

	fetchCampaignsClientSide = async (trpcInit: TRPCClientInit) => {
		const inMemoryStorage = browser ? localStorage : undefined;
		let user;
		try {
			user = await trpc(trpcInit).auth.me.query();
		} catch {
			user = undefined;
		}
		return ListCampaignsUseCase({
			getCompletionByCampaign: async (campaigns) => {
				const localAttempts: AttemptsByCampaign[] = !inMemoryStorage
					? []
					: (campaigns
							.map((c) => {
								const localCampaign = inMemoryStorage.getItem(c.name);
								if (!localCampaign) return undefined;
								return {
									campaignName: c.name,
									attempts: JSON.parse(localCampaign)
								} as AttemptsByCampaign;
							})
							.filter((a) => a !== undefined) as AttemptsByCampaign[]);
				return trpc(trpcInit).dashboard.listCampaigns.getCompletionByCampaign.query({
					campaigns,
					localAttempts
				});
			},
			listCampaignsJoinedByUser: () =>
				trpc(trpcInit).dashboard.listCampaigns.listCampaignsJoinedByUser.query()
		})
			.execute({
				userId: user?.id
			})
			.then((ucResult) => {
				if (ucResult.isSuccess) return ucResult.data;
				AppNotificationService.send({
					message: 'Failed to fetch campaigns',
					type: 'ERROR'
				});
				return [];
			})
			.catch((err) => {
				console.error(err);
				AppNotificationService.send({
					message: 'Failed to fetch campaigns',
					type: 'ERROR'
				});
				return [];
			});
	};
}
