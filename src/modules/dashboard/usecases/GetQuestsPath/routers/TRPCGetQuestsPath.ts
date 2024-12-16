import { allowDemoAuthProcedure } from '$lib/trpc/middlewares/demo.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaGetQuestsPathRepository } from '../repositories/PrismaGetQuestsPathRepository';
import { TRPCError } from '@trpc/server';
import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';

export const GetQuestsPathRouter = t.router({
	listQuestsFromCampaign: allowDemoAuthProcedure
		.input(
			z.object({
				campaignName: z.string()
			})
		)
		.query(({ ctx, input }) => {
			const repository = PrismaGetQuestsPathRepository(ctx.prisma);
			return repository.listQuestsFromCampaign(input.campaignName);
		}),
	listCompletedQuestsForCampaign: authProcedure
		.input(
			z.object({
				campaignName: z.string()
			})
		)
		.query(({ ctx, input }) => {
			if (!ctx.user) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Cannot get completed quests unauthorized user'
				});
			}
			const repository = PrismaGetQuestsPathRepository(ctx.prisma);
			return repository.listCompletedQuestsForCampaign(input.campaignName, ctx.user.id);
		})
});
