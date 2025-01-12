import { UseCaseResponseBuilder, type InputFactory, type OutputFactory, type UseCase } from '$lib/interfaces/UseCase';
import type { DashboardCampaignItem } from './aggregates/DashboardCampaignItem';
import * as IListCampaignsRepository from './repositories/IListCampaignsRepository';

type Input = InputFactory<{
	userId?: string;
}, {
	listCampaignsJoinedByUser: IListCampaignsRepository.ListCampaignsJoinedByUser;
	getCompletionByCampaign: IListCampaignsRepository.GetCompletionByCampaign;
}>;
type Output = OutputFactory<DashboardCampaignItem[]>;

export const ListCampaignsUseCase: UseCase<Input, Output> = (deps) => {
	const { listCampaignsJoinedByUser, getCompletionByCampaign } = deps;

	return {
		execute: async (input) => {
			const { userId } = input;
			const campaigns = await listCampaignsJoinedByUser(userId);

			const completion = await getCompletionByCampaign(campaigns, userId ?? '');

			const result: DashboardCampaignItem[] = campaigns.map((c) => ({
				id: c.id,
				name: c.name,
				slug: c.slug,
				nbOfTasks: c.nbOfTasks,
				completion: Math.round(completion.find((campaignCompletion) => campaignCompletion.campaignName === c.name)?.completion ?? 0)
			}));

			return UseCaseResponseBuilder.success(200, result);
		}
	}
}