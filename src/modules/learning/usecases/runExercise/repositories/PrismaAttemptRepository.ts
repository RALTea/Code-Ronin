import type { PrismaClient } from '@prisma/client';
import * as IRunExerciseRepository from './IRunExerciseRepository';

type _PrismaAttemptRepository = {
	handleSuccess: IRunExerciseRepository.HandleSuccess;
	handleFail: IRunExerciseRepository.HandleFail;
};

export const PrismaAttemptRepository = (prisma: PrismaClient): _PrismaAttemptRepository => {
	return {
		handleSuccess: async (data) => {
			await prisma.attempt.create({
				data: {
					tasks: {
						connect: { id: data.taskId }
					},
					apprentice: {
						connect: { id: data.apprenticeId }
					},
					userSolution: data.apprenticeSolution,
					isSuccess: data.success
				}
			});
		},
		handleFail: async (data) => {
			await prisma.attempt.create({
				data: {
					tasks: {
						connect: { id: data.taskId }
					},
					apprentice: {
						connect: { id: data.apprenticeId }
					},
					userSolution: data.apprenticeSolution,
					isSuccess: data.success
				}
			});
		}
	};
};
