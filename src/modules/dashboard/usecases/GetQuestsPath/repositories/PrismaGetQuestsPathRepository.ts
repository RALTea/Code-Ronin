import type { PrismaClient } from '@prisma/client';
import * as IGetQuestsPathRepository from './IGetQuestsPathRepository';

type _PrismaGetQuestsPathRepository = {
	listQuestsFromCampaign: IGetQuestsPathRepository.ListQuestsFromCampaign;
	listCompletedQuestsForCampaign: IGetQuestsPathRepository.ListCompletedQuestsForCampaign;
};

export const PrismaGetQuestsPathRepository = (
	prisma: PrismaClient
): _PrismaGetQuestsPathRepository => {
	return {
		listQuestsFromCampaign: async (campaignName: string) => {
			const quests = await prisma.quest.findMany({
				where: {
					campaign: {
						name: campaignName
					}
				}
			});
			return quests;
		},
		listCompletedQuestsForCampaign: async (campaignName: string, userId: string) => {
			const completedQuests = await prisma.quest.findMany({
				where: {
					campaign: {
						name: campaignName
					},
					tasks: {
						every: {
							attempts: {
								some: {
									apprenticeId: userId,
									isSuccess: true
								}
							}
						}
					}
				}
			});
			return completedQuests;
		}
	};
};
