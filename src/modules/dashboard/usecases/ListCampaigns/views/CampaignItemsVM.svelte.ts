import type { DashboardCampaignItem } from '../aggregates/DashboardCampaignItem';

export class CampaignItemsVM {
	firstLoadCompleted: boolean = $state(false);
	isLoading: boolean = $state(false);
	campaigns: DashboardCampaignItem[] = $state([]);

	constructor(fetchCampaigns: Promise<DashboardCampaignItem[]>) {
		fetchCampaigns.then((campaigns) => {
			this.firstLoadCompleted = true;
			this.campaigns = campaigns;
		})
	}
}