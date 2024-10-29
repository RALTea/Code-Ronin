import { authRouter } from '$lib/trpc/routes/auth.route';
import { t } from '$lib/trpc/t';
import RunExercisesRouter from '$learning/usecases/runExercise/routers/run-exercises';
import GetTaskDetailsRouter from '$learning/usecases/getTaskDetails/routers/getTaskDetailsRouter';

export const router = t.router({
	authRouter,
	learning: t.router({
		getTaskDetails: GetTaskDetailsRouter,
		runExercises: RunExercisesRouter
	}),
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
