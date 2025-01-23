import type { DashboardCampaignItem } from '../aggregates/DashboardCampaignItem';

export class CampaignItemsVM {
	firstLoadCompleted: boolean = $state(false);
	isLoading: boolean = $state(false);
	campaigns: DashboardCampaignItem[] = $state([]);
	joinCampaignModalOpen: boolean = $state(false);

	constructor(fetchCampaigns: Promise<DashboardCampaignItem[]>) {
		fetchCampaigns.then((campaigns) => {
			this.firstLoadCompleted = true;
			this.campaigns = campaigns;
		})
	}

	openJoinCampaignModal() {
		this.joinCampaignModalOpen = true;
	}

	closeJoinCampaignModal() {
		this.joinCampaignModalOpen = false;
	}
}