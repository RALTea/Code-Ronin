import { t } from '$lib/trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ ctx, next, path }) => {
	// console.debug('Auth middleware', path);
	if (!ctx.user) {
		console.debug('User not authenticated', path);
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	return next({ ctx });
});

export const authProcedure = t.procedure.use(authMiddleware);
