import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { createTRPCRouter } from '$lib/trpc/t';

export const AuthRouter = createTRPCRouter({
	me: authProcedure.query(async ({ ctx }) => ctx.user),
	
});
