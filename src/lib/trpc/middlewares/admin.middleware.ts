import { TRPCError } from '@trpc/server';
import { authMiddleware } from '$lib/trpc/middlewares/auth.middleware';
import { t } from '$lib/trpc/t';

const adminMiddleware = t.middleware(async ({ ctx, next }) => {
	if (ctx.user?.role !== 'ADMIN') throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next({ ctx });
});

export const adminProcedure = t.procedure.use(authMiddleware).use(adminMiddleware);
