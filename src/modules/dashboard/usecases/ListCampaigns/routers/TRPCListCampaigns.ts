import { publicProcedure, t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaListCampaignsRepository } from '../repositories/PrismaListCampaignsRepository';

export const ListCampaignsRouter = t.router({
	listCampaignsJoinedByUser: publicProcedure.input(z.void()).query(({ ctx }) => {
		const repository = PrismaListCampaignsRepository(ctx.prisma);
		return repository.listCampaignsJoinedByUser(ctx.user?.id);
	}),
	getCompletionByCampaign: publicProcedure
		.input(
			z.object({
				campaignNames: z.array(z.string())
			})
		)
		.query(({ ctx, input }) => {
			const { campaignNames } = input;
			const repository = PrismaListCampaignsRepository(ctx.prisma);
			if (!ctx.user) return [];
			return repository.getCompletionByCampaign(campaignNames, ctx.user.id);
		})
});
