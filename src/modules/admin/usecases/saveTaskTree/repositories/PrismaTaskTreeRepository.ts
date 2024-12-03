import type { PrismaClient } from '@prisma/client';
import * as ITaskTreeRepository from './ITaskTreeRepository';

type _PrismaTaskTreeRepository = {
	update: ITaskTreeRepository.UpdateTasks;
};

export const PrismaTaskTreeRepository = (prisma: PrismaClient): _PrismaTaskTreeRepository => {
	return {
		update: async (tasks) => {
			prisma.$transaction(async (prisma) => {
				prisma.task.updateMany({
					data: tasks.map(() => ({
						previousTasks: {
							disconnect: true
						},
						nextTasks: {
							disconnect: true
						}
					}))
				})
				prisma.task.updateMany({
					data: tasks.map((task) => ({
						previousTasks: {
							connect: (task.previousTaskIds ?? []).map((id) => ({ id }))
						},
						nextTasks: {
							connect: (task.nextTaskIds ?? []).map((id) => ({ id }))
						},
					}))
				})
			})
		}
	};
};