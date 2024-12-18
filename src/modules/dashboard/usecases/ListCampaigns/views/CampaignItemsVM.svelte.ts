import type { DashboardCampaignItem } from '../aggregates/DashboardCampaignItemSchema';

export class CampaignItemsVM {
	firstLoadCompleted: boolean = $state(false);
	isLoading: boolean = $state(false);
	campaigns: DashboardCampaignItem[] = $state([]);

	constructor(fetchCampaigns: Promise<DashboardCampaignItem[]>) {
		console.debug('CampaignItemsVM.constructor');
		fetchCampaigns.then((campaigns) => {
			this.firstLoadCompleted = true;
			this.campaigns = campaigns;
		})
	}
}