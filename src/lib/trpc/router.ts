import GetProgressionRouter from '$learning/usecases/getProgression/routers/getProgression';
import GetTaskDetailsRouter from '$learning/usecases/getTaskDetails/routers/getTaskDetailsRouter';
import RunExercisesRouter from '$learning/usecases/runExercise/routers/run-exercises';
import GetApprenticeProfileSummaryRouter from '$learning/usecases/getApprenticeProfileSummary/routers/getApprenticeProfileSummary';
import { authRouter } from '$lib/trpc/routes/auth.route';
import { t } from '$lib/trpc/t';
import { GetQuestDataTRPCRouter } from '../../modules/admin/usecases/getQuestData/routers/GetQuestDataTRPCRouter';
import { CreateTaskTRPCRouter } from '$admin/usecases/createTask/routers/CreateTaskTRPCRouter';
import { GetTaskDataTRPCRouter } from '$admin/usecases/getTaskData/routers/GetTaskDataTRPCRouter';
import { EditTaskTRPCRouter } from '$admin/usecases/editTask/routers/EditTaskTRPCRouter';

export const router = t.router({
	authRouter,
	learning: t.router({
		getTaskDetails: GetTaskDetailsRouter,
		runExercises: RunExercisesRouter,
		getProgression: GetProgressionRouter,
		getApprenticeProfileSummary: GetApprenticeProfileSummaryRouter,
	}),
	admin: t.router({
		getQuestData: GetQuestDataTRPCRouter,
		createTask: CreateTaskTRPCRouter,
		getTask: GetTaskDataTRPCRouter,
		editTask: EditTaskTRPCRouter,
	})
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
