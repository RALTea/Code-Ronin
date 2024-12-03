import type { PrismaClient } from '@prisma/client';
import * as ICreateTaskRepository from './ICreateTaskRepository';

type _PrismaCreateTaskRepository = {
	saveTask: ICreateTaskRepository.saveTask;
};

export const PrismaCreateTaskRepository = (prisma: PrismaClient): _PrismaCreateTaskRepository => {
	return {
		saveTask: async (task) => {
			await prisma.task.create({
				data: {
					name: task.name,
					previousTasks: {
						connect: (task.previousTaskIds ?? []).map((id) => ({ id }))
					},
					nextTasks: {
						connect: (task.nextTaskIds ?? []).map((id) => ({ id }))
					},
					instructions: task.instructions,
					exp: task.exp,
					isMiniboss: task.isMiniboss,
					questId: task.questId,
					order: task.order ?? 0,
					answerType: 'tests',
					validations: {
						create: [
							{
								testFileUrl: task.validation.testFileName,
								expectedStderr: task.validation.expectedStderr,
								expectedStdout: task.validation.expectedStdout,
								snippets: {
									create: [
										...(task.validation.forbiddenSnippets ?? []).map((snippet) => ({
											content: snippet,
											type: 'FORBIDDEN'
										})),
										...(task.validation.mandatorySnippets ?? []).map((snippet) => ({
											content: snippet,
											type: 'REQUIRED'
										}))
									]
								}
							}
						]
					}
				}
			});
		}
	};
};
