import type { QuestTree } from '$dashboard/usecases/GetQuestsPath/aggregates/QuestTree';
import { GetQuestsPathUseCase } from '$dashboard/usecases/GetQuestsPath/GetQuestsPath';
import type { DashboardCampaignItem } from '$dashboard/usecases/ListCampaigns/aggregates/DashboardCampaignItemSchema';
import { trpc } from '$lib/clients/trpc';
import { AppNotificationService } from '$notifications/services/AppNotificationService';
import type { TRPCClientInit } from 'trpc-sveltekit';

export class DashboardVM {
	private getQuestsPathUseCase;
	selectedCampaign = $state('');
	loadQuest: Promise<QuestTree> | undefined = $state(undefined);
	lastQuestsUpdate: string = $state('');

	onCampaignSelected = (campaignName: string) => {
		this.selectedCampaign = campaignName;
		this.loadQuest = this.getQuestsPathUseCase
			.execute({
				campaignName: this.selectedCampaign,
				userId: '-1'
			})
			.then((ucResult) => {
				this.lastQuestsUpdate = new Date().getTime().toString();
				if (ucResult.isSuccess) return ucResult.data;
				AppNotificationService.send({ message: ucResult.message, type: 'ERROR' });
				return [];
			});
	};

	constructor(init: TRPCClientInit, fetchCampaigns: Promise<DashboardCampaignItem[]>) {
		fetchCampaigns.then((campaigns) => {
			if (campaigns.length > 0) this.onCampaignSelected(campaigns[0].name);
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
}
