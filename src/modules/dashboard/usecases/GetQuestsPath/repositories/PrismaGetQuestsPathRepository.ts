import type { PrismaClient } from '@prisma/client';
import * as IGetQuestsPathRepository from './IGetQuestsPathRepository';

type _PrismaGetQuestsPathRepository = {
	listQuestsFromCampaign: IGetQuestsPathRepository.ListQuestsFromCampaign;
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
		}
	};
};
