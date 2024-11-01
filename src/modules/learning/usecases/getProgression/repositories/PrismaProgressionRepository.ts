import type { Task } from '$learning/domain/Task';
import type { PrismaClient } from '@prisma/client';
import type { GetApprenticeAttemptsOnQuest, GetTasksFromQuest } from './IProgressionRepository';

type PrismaProgressionRepository = {
	getTasksFromQuest: GetTasksFromQuest;
	getApprenticeAttemptsOnQuest: GetApprenticeAttemptsOnQuest;
};
export const PrismaProgressionRepository = (prisma: PrismaClient): PrismaProgressionRepository => {
	return {
		getTasksFromQuest: async (questId): Promise<Task[]> => {
			const tasks = await prisma.task.findMany({
				where: { questId },
				include: {
					nextTasks: true
				}
			});
			return tasks.map((task) => ({
				...task,
				nextTaskId: task.nextTasks.at(0)?.id
			}));
		},
		getApprenticeAttemptsOnQuest: async (apprenticeId, questId) => {
			const attempts = await prisma.attempt.findMany({
				where: {
					apprenticeId,
					tasks: {
						questId: questId
					}
				}
			});
			return attempts.map((attempt) => ({
				...attempt,
				questId,
				date: attempt.createdAt.toISOString(),
				success: attempt.isSuccess
			}));
		}
	};
};
