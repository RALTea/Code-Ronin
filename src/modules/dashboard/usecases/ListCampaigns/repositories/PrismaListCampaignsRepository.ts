import type { Campaign, PrismaClient, Quest, Task } from '@prisma/client';
import * as IListCampaignsRepository from './IListCampaignsRepository';
import type { CampaignInfos } from '../aggregates/CampaignInfos';
import type { CampaignCompletion } from '../aggregates/CampaignCompletion';

type _PrismaListCampaignsRepository = {
	listCampaignsJoinedByUser: IListCampaignsRepository.ListCampaignsJoinedByUser;
	getCompletionByCampaign: IListCampaignsRepository.GetCompletionByCampaign;
};

export const PrismaListCampaignsRepository = (
	prisma: PrismaClient
): _PrismaListCampaignsRepository => {
	return {
		listCampaignsJoinedByUser: async (userId?: string) => {
			const mapPrismaCampaignToCampaignInfos = (
				campaign: Campaign & { quests: (Quest & { tasks: Task[] })[] }
			): CampaignInfos => {
				return {
					id: campaign.id,
					name: campaign.name,
					slug: campaign.slug,
					nbOfTasks: campaign.quests.reduce((sum, quest) => sum + quest.tasks.length, 0)
				};
			};
			if (!userId) {
				const campaigns = await prisma.campaign.findMany({
					where: {
						isDemo: true
					},
					include: { quests: { include: { tasks: true } } }
				});
				return campaigns.map(mapPrismaCampaignToCampaignInfos);
			}

			const campaigns = await prisma.campaign.findMany({
				where: { OR: [
					{ apprentices: { some: { id: userId } } },
					{ isDemo: true }
				] },
				include: { quests: { include: { tasks: true } } }
			});
			return campaigns.map(mapPrismaCampaignToCampaignInfos);
		},
		getCompletionByCampaign: async (
			campaigns: CampaignInfos[],
			userId?: string
		): Promise<CampaignCompletion[]> => {
			const campaignNames = campaigns.map((c) => c.name);
			const completions = await prisma.campaign.findMany({
				where: {
					name: {
						in: campaignNames
					}
				},
				select: {
					name: true,
					quests: {
						select: {
							tasks: {
								select: {
									_count: true,
									attempts: {
										where: {
											AND: [{ apprenticeId: userId }, { isSuccess: true }]
										}
									}
								}
							},
							_count: {
								select: {
									tasks: true
								}
							}
						}
					}
				}
			});

			return completions.map((campaign) => {
				const totalTasks = campaign.quests.reduce((sum, quest) => sum + quest._count.tasks, 0);

				const completedTasks = campaign.quests.reduce(
					(sum, quest) =>
						sum +
						quest.tasks.reduce((taskSum, task) => taskSum + (task.attempts.length > 0 ? 1 : 0), 0),
					0
				);

				return {
					campaignName: campaign.name,
					completion: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
				};
			});
		}
	};
};
