import type { PrismaClient } from '@prisma/client';
import * as IQuestRepository from './IQuestRepository';
import { QuestNotFoundError } from '../errors/QuestNotFoundError';

type _PrismaQuestRepository = {
	getQuestData: IQuestRepository.GetQuestData;
};

export const PrismaQuestRepository = (prisma: PrismaClient): _PrismaQuestRepository => {
	return {
		getQuestData: async (questId) => {
			const prismaQuest = await prisma.quest.findUnique({
				where: { id: questId },
				include: {
					tasks: {
						include: { nextTasks: true, previousTasks: true }
					}
				}
			});
			if (!prismaQuest) throw new QuestNotFoundError(questId);
			return {
				id: prismaQuest.id,
				name: prismaQuest.name,
				tasks: [
					prismaQuest.tasks.map((task) => ({
						name: task.name,
						id: task.id,
						nextTaskIds: task.nextTasks.map((t) => t.id),
						previousTaskIds: task.previousTasks.map((t) => t.id)
					}))
				]
			};
		}
	};
};
