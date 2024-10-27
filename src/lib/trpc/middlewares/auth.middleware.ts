import { TRPCError } from '@trpc/server';
import { t } from '$lib/trpc/t';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
	if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next({ ctx });
});

export const authProcedure = t.procedure.use(authMiddleware);
