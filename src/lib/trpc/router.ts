import GetProgressionRouter from '$learning/usecases/getProgression/routers/getProgression';
import GetTaskDetailsRouter from '$learning/usecases/getTaskDetails/routers/getTaskDetailsRouter';
import RunExercisesRouter from '$learning/usecases/runExercise/routers/run-exercises';
import { authRouter } from '$lib/trpc/routes/auth.route';
import { t } from '$lib/trpc/t';

export const router = t.router({
	authRouter,
	learning: t.router({
		getTaskDetails: GetTaskDetailsRouter,
		runExercises: RunExercisesRouter,
		getProgression: GetProgressionRouter,
	})
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
