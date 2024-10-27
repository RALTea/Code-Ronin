import { authRouter } from '$lib/trpc/routes/auth.route';
import { t } from '$lib/trpc/t';
import RunExercisesRouter from '$learning/routers/run-exercises'

export const router = t.router({
	authRouter,
	runExercises: RunExercisesRouter,
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
