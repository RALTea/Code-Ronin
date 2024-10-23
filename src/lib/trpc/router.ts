import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { authRouter } from '$lib/trpc/authRouteur';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  }),
  authRouter,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
