import * as IRunExerciseRepository from './IRunExerciseRepository';
import { PrismaClient } from '@prisma/client';
import { TaskNotFoundError } from '../errors/TaskNotFoundError';
import { AnswerTypeSchema } from '../aggregates/TaskDetails';

type _PrismaTaskRepository = {
	getTaskDetails: IRunExerciseRepository.FetchTaskDetails;
};

export const PrismaTaskRepository = (prisma: PrismaClient): _PrismaTaskRepository => {
	return {
		getTaskDetails: async (taskId) => {
			const task = await prisma.task.findUnique({
				where: { id: taskId },
				select: {
					answerType: true
				}
			});
			if (!task) throw new TaskNotFoundError(taskId);
			const answerType = AnswerTypeSchema.parse(task.answerType);
			return {
				answerType
			};
		}
	};
};
