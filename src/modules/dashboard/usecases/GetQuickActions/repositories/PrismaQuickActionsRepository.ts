import type { PrismaClient } from '@prisma/client';
import * as IQuickActionsRepository from './IQuickActionsRepository';

type _PrismaQuickActionsRepository = {
	ListTasksCompletedByUserForQuest: IQuickActionsRepository.ListTasksCompletedByUserForQuest;
};

export const PrismaQuickActionsRepository = (
	prisma: PrismaClient
): _PrismaQuickActionsRepository => {
	return {
		ListTasksCompletedByUserForQuest: async (questId, userId) => {
			const prismaTasks = await prisma.task.findMany({
				where: { questId },
				include: {
					previousTasks: { select: { id: true } },
					nextTasks: { select: { id: true } },
					attempts: {
						where: {
							apprenticeId: userId,
							isSuccess: true // We only fetch successful attempts
						}
					}
				}
			});

			const completedTaskIds = new Set(
				prismaTasks.filter((task) => task.attempts.length > 0).map((task) => task.id)
			);

			return prismaTasks.map((task) => {
				// This is now correct because we only fetched successful attempts
				const isCompleted = task.attempts.length > 0;

				const isLocked =
					task.previousTasks.length > 0 &&
					!task.previousTasks.some((prevTask) => completedTaskIds.has(prevTask.id));

				return {
					id: task.id,
					name: task.name,
					previousTaskIds: task.previousTasks.map((t) => t.id),
					nextTaskIds: task.nextTasks.map((t) => t.id),
					isLocked,
					isCompleted
				};
			});
		}
	};
};
