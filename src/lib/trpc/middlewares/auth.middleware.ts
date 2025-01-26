import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
	// console.debug('Auth middleware');
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({ ctx: { ...ctx, user: ctx.user } });
});

export const authProcedure = t.procedure.use(authMiddleware);
