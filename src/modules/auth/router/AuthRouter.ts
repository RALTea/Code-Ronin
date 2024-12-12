import { adminProcedure } from '$lib/trpc/middlewares/admin.middleware';
import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { createTRPCRouter } from '$lib/trpc/t';

export const AuthRouter = createTRPCRouter({
	me: authProcedure.query(async ({ ctx }) => ctx.user),
	amIAdmin: adminProcedure.query(async ({ ctx }) => ctx.user),
});
