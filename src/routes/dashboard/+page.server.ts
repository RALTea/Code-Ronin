import type { DashboardCampaignItem } from '$dashboard/usecases/ListCampaigns/aggregates/DashboardCampaignItem';
import { ListCampaignsUseCase } from '$dashboard/usecases/ListCampaigns/ListCampaigns';
import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { AppNotificationService } from '$notifications/services/AppNotificationService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(await createContext(event));
	let user;
	try {
		user = await trpc.auth.me();
	} catch {
		user = undefined;
	}
	const fetchCampaigns = ListCampaignsUseCase({
		getCompletionByCampaign: async (campaigns) => {
			return trpc.dashboard.listCampaigns.getCompletionByCampaign({ campaigns });
		},
		listCampaignsJoinedByUser: () => trpc.dashboard.listCampaigns.listCampaignsJoinedByUser()
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
			return [] as DashboardCampaignItem[];
		})
		.catch((err) => {
			console.error(err);
			AppNotificationService.send({
				message: 'Failed to fetch campaigns',
				type: 'ERROR'
			});
			return [] as DashboardCampaignItem[];
		});

	return {
		fetchCampaigns: fetchCampaigns,
		anonymousSession: user === undefined
	};
};
