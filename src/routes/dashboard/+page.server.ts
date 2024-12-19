import { ListCampaignsUseCase } from '$dashboard/usecases/ListCampaigns/ListCampaigns';
import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import { AppNotificationService } from '$notifications/services/AppNotificationService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(await createContext(event));
	const user = await trpc.auth.me();
	const fetchCampaigns = ListCampaignsUseCase({
		getCompletionByCampaign: (campaignNames) => {
			return trpc.dashboard.listCampaigns.getCompletionByCampaign({ campaignNames });
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

	return {
		fetchCampaigns: fetchCampaigns
	};
};
