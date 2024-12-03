import type { PrismaClient } from '@prisma/client';
import * as IGetTaskDataRepository from "./IGetTaskDataRepository";
import { TaskNotFound } from '../errors/TaksNotFound';
import type { TaskData } from '$admin/domain/TaskData';

type _PrismaGetTaskRepository = {
	getTaskData: IGetTaskDataRepository.GetTaskData;
}

export const PrismaGetTaskRepository = (prisma: PrismaClient): _PrismaGetTaskRepository => {
	return {
		getTaskData: async (taskId) => {
			const taskData = await prisma.task.findFirst({
				where: { id: taskId },
				include: {
					nextTasks: true,
					previousTasks: true,
					validations: {
						include: {
							snippets: true
						}
					}
				}
			});
			if (!taskData) throw new TaskNotFound();
			const result: TaskData = {
				id: taskData.id,
				exp: taskData.exp,
				instructions: taskData.instructions,
				name: taskData.name,
				isMiniboss: taskData.isMiniboss,
				nextTaskIds: taskData.nextTasks.map(task => task.id),
				previousTaskIds: taskData.previousTasks.map(task => task.id),
				validation: {
					expectedStderr: taskData.validations.at(0)?.expectedStderr ?? undefined,
					expectedStdout: taskData.validations.at(0)?.expectedStdout ?? undefined,
					forbiddenSnippets: taskData.validations.at(0)?.snippets.filter(snippet => snippet.type === 'FORBIDDEN').map(snippet => snippet.content),
					mandatorySnippets: taskData.validations.at(0)?.snippets.filter(snippet => snippet.type === 'REQUIRED').map(snippet => snippet.content),
					testFileName: taskData.validations.at(0)?.testFileUrl ?? undefined
				}
			}
			return result;
		}
	}
}