import db from '$lib/server/db';
import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaJoinNewCampaignRepository } from '../repositories/PrismaJoinNewCampaignRepository';

const repository = PrismaJoinNewCampaignRepository(db);
export const JoinNewCampaignRouter = t.router({
	getCampaignByAccessKey: authProcedure
		.input(z.object({ accessKey: z.string() }))
		.query(async ({ input }) => {
			const { accessKey } = input;
			return repository.getCampaignByAccessKey(accessKey);
		}),
	hasUserJoinedCampaign: authProcedure
		.input(
			z.object({
				userId: z.string(),
				campaignId: z.string()
			})
		)
		.query(async ({ input }) => {
			const { userId, campaignId } = input;
			return repository.hasUserJoinedCampaign(userId, campaignId);
		}),
	joinCampaign: authProcedure
		.input(
			z.object({
				userId: z.string(),
				campaignId: z.string(),
				accessKey: z.string()
			})
		)
		.mutation(async ({ input }) => {
			const { userId, campaignId, accessKey } = input;
			return repository.joinCampaign(userId, campaignId, accessKey);
		}),
	transferProgressionFromDemo: authProcedure
		.input(
			z.object({
				userId: z.string(),
				campaignId: z.string(),
				options: z
					.object({
						overwriteExisting: z.boolean().default(false)
					})
					.optional()
			})
		)
		.mutation(async ({ input }) => {
			const { userId, campaignId, options } = input;
			return repository.transferProgressionFromDemo(options ?? { overwriteExisting: false })(
				userId,
				campaignId
			);
		}),
	getAccessKeyDetails: authProcedure
		.input(z.object({ accessKey: z.string() }))
		.query(async ({ input }) => {
			const { accessKey } = input;
			return repository.getAccessKeyDetails(accessKey);
		}),
	getFirstQuestId: authProcedure
		.input(z.object({ campaignId: z.string() }))
		.query(async ({ input }) => {
			const { campaignId } = input;
			return repository.getFirstQuestId(campaignId);
		})
});
