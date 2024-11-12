import type { Validation } from '$learning/domain/Validation';
import prisma from '$lib/server/db';
import { NoValidationsLinkedToTaskError } from '../errors/NoValidationsLinkedToTask';
import { TaskNotFound } from '../errors/TaskNotFound';
import type { GetTaskDetails } from './IGetTaskDetailsRepository';

type _PrismaGetTaskDetailsRepository = {
	run: GetTaskDetails;
};
export const PrismaGetTaskDetailsRepository = (): _PrismaGetTaskDetailsRepository => {
	return {
		run: async (id: string) => {
			const task = await prisma.task.findUnique({
				where: { id },
				include: {
					nextTasks: true,
					validations: {
						include: {
							snippets: true
						}
					},
					attempts: {
						orderBy: {
							createdAt: 'desc'
						},
						take: 1
					}
				}
			});
			if (!task) throw new TaskNotFound(`Task with id ${id} not found`);
			if (!task.validations || task.validations.length === 0) {
				throw new NoValidationsLinkedToTaskError();
			}

			const firstValidation = task.validations[0];
			const validation: Validation = {
				taskId: id,
				expectedStderr: firstValidation.expectedStderr ?? undefined,
				expectedStdout: firstValidation.expectedStdout ?? undefined,
				forbiddenSnippets: firstValidation.snippets.filter(snippet => snippet.type === 'FORBIDDEN').map(snippet => snippet.content),
				mandatorySnippets: firstValidation.snippets.filter(snippet => snippet.type === 'MANDATORY').map(snippet => snippet.content),
				testFileNames: [(firstValidation.testFileUrl ?? '')],
			}


			return {
				id: task.id,
				instructions: task.instructions,
				validation: validation,
				nextTasksIds: task.nextTasks ? task.nextTasks.map(task => task.id) : undefined,
				lastInput: task.attempts[0] ? {
					code: task.attempts[0].userSolution,
					date: task.attempts[0].createdAt.getTime()
				} : undefined
			}
		}
	};
};
