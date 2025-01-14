import prisma from '$lib/server/db';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../t';

export const DemoContentSchema = z.object({
	campaignName: z.string()
});

export type DemoContent = z.infer<typeof DemoContentSchema>;

// Allow unauthorized access to the demo campaigns only, block access to other campaigns
export const demoMiddleware = t.middleware(async (request) => {
	const { path, ctx, next, rawInput } = request;

	// Check if the campaign name is the demo campaign
	try {
		const { campaignName } = DemoContentSchema.parse(rawInput);
		const campaign = await prisma.campaign.findFirst({
			where: {
				OR: [{ name: campaignName }, { slug: campaignName }]
			}
		});
		console.debug('Demo campaign', { campaignName, campaign, isDemo: campaign?.isDemo === true });
		if (campaign?.isDemo === true) {
			return next({ ctx });
		}
	} catch {
		console.error(`TRPC query ${path} does not match DemoContentSchema`);
		throw new TRPCError({ code: 'BAD_REQUEST' });
	}

	// Allow authenticated users to access the campaigns
	const user = ctx.user;
	if (user) {
		return next({ ctx });
	}
	console.debug('User not authenticated', path);
	throw new TRPCError({ code: 'UNAUTHORIZED' });
});

export const allowDemoAuthProcedure = t.procedure.use(demoMiddleware);
