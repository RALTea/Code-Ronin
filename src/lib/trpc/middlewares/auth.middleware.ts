import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
	if (!ctx.user) {
		console.debug("TRPC throwing UNAUTHORIZED")
		// throw error(401)
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({ ctx });
});

export const authProcedure = t.procedure.use(authMiddleware);
