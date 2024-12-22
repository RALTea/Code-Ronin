import GetProgressionRouter from '$learning/usecases/getProgression/routers/getProgression';
import GetTaskDetailsRouter from '$learning/usecases/getTaskDetails/routers/getTaskDetailsRouter';
import RunExercisesRouter from '$learning/usecases/runExercise/routers/run-exercises';
import GetApprenticeProfileSummaryRouter from '$learning/usecases/getApprenticeProfileSummary/routers/getApprenticeProfileSummary';

import { t } from '$lib/trpc/t';
import { GetQuestDataTRPCRouter } from '$admin/usecases/getQuestData/routers/GetQuestDataTRPCRouter';
import { CreateTaskTRPCRouter } from '$admin/usecases/createTask/routers/CreateTaskTRPCRouter';
import { GetTaskDataTRPCRouter } from '$admin/usecases/getTaskData/routers/GetTaskDataTRPCRouter';
import { EditTaskTRPCRouter } from '$admin/usecases/editTask/routers/EditTaskTRPCRouter';
import { AuthRouter } from '$auth/router/AuthRouter';
import { GetQuestsPathRouter } from '$dashboard/usecases/GetQuestsPath/routers/TRPCGetQuestsPath';
import { ListCampaignsRouter } from '$dashboard/usecases/ListCampaigns/routers/TRPCListCampaigns';
import { QuickActionsRouter } from '$dashboard/usecases/GetQuickActions/routers/TRPCQuickActions';

export const router = t.router({
	auth: AuthRouter,
	learning: t.router({
		getTaskDetails: GetTaskDetailsRouter,
		runExercises: RunExercisesRouter,
		getProgression: GetProgressionRouter,
		getApprenticeProfileSummary: GetApprenticeProfileSummaryRouter
	}),
	admin: t.router({
		getQuestData: GetQuestDataTRPCRouter,
		createTask: CreateTaskTRPCRouter,
		getTask: GetTaskDataTRPCRouter,
		editTask: EditTaskTRPCRouter
	}),
	dashboard: t.router({
		getQuestsPath: GetQuestsPathRouter,
		listCampaigns: ListCampaignsRouter,
		quickActions: QuickActionsRouter,
	})
});

export type Router = typeof router;
export const createCaller = t.createCallerFactory(router);
