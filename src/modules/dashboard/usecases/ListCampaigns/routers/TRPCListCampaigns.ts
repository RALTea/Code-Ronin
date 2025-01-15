import { publicProcedure, t } from '$lib/trpc/t';
import { z } from 'zod';
import { AttemptsByCampaignSchema } from '../aggregates/AttemptByCampaign';
import { CampaignInfosSchema } from '../aggregates/CampaignInfos';
import * as IListCampaignsRepository from '../repositories/IListCampaignsRepository';
import { InMemoryListCampaignsRepository } from '../repositories/InMemoryListCampaignsRepository';
import { PrismaListCampaignsRepository } from '../repositories/PrismaListCampaignsRepository';

export const ListCampaignsRouter = t.router({
	listCampaignsJoinedByUser: publicProcedure.input(z.void()).query(({ ctx }) => {
		const repository = PrismaListCampaignsRepository(ctx.prisma);
		return repository.listCampaignsJoinedByUser(ctx.user?.id);
	}),
	getCompletionByCampaign: publicProcedure
		.input(
			z.object({
				campaigns: CampaignInfosSchema.array(),
				localAttempts: AttemptsByCampaignSchema.array().optional().default([])
			})
		)
		.query(async ({ ctx, input }) => {
			const { campaigns, localAttempts } = input;
			let repository: {
				getCompletionByCampaign: IListCampaignsRepository.GetCompletionByCampaign;
			} = PrismaListCampaignsRepository(ctx.prisma);

			// Todo: listing only joined campaigns, should include all demo campaigns
			if (!ctx.user) {
				repository = InMemoryListCampaignsRepository(localAttempts);
			}
			const result = await repository.getCompletionByCampaign(campaigns, ctx.user?.id);
			console.debug('getCompletionByCampaign', result);
			return result;
		})
});
