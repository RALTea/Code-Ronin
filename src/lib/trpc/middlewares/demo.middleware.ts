import { env } from '$env/dynamic/public';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { t } from '../t';

export const DemoContentSchema = z.object({
	campaignName: z.string()
});

export type DemoContent = z.infer<typeof DemoContentSchema>;

// Allow unauthorized access to the demo campaigns only, block access to other campaigns
export const demoMiddleware = t.middleware(async (request) => {
	const { path, input, ctx, next, meta, rawInput, type} = request;
	const { PUBLIC_DEMO_CAMPAIGN_NAME } = env;

	// Check if the campaign name is the demo campaign
	try {
		console.debug('Validating TRPC query', {
			path, input, meta, rawInput, type
		});
		const { campaignName } = DemoContentSchema.parse(rawInput);
		if (campaignName === PUBLIC_DEMO_CAMPAIGN_NAME) return next({ ctx });
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