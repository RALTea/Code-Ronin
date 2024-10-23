import { authRouter } from '$lib/trpc/routes/auth.route';
import { t } from '$lib/trpc/t';

export const router = t.router({
  authRouter,
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
