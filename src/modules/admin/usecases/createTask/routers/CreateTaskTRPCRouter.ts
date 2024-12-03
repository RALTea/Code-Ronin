import { adminProcedure } from '$lib/trpc/middlewares/admin.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { CreateTaskDtoSchema } from '../aggregates/CreateTaskDto';
import { CreateTaskUseCase } from '../createTask';
import { PrismaCreateTaskRepository } from '../repositories/PrismaCreateTaskRepository';

export const CreateTaskTRPCRouter = t.router({
	createTask: adminProcedure
		.input(
			CreateTaskDtoSchema.merge(
				z.object({
					questId: z.string(),
					order: z.number().optional().default(0)
				})
			)
		)
		.query(async ({ input, ctx }) => {
			const createdTask = await CreateTaskUseCase({
				saveTask: PrismaCreateTaskRepository(ctx.prisma).saveTask
			}).execute(input);
			if (!createdTask.isSuccess) {
				throw new Error('Failed to create task');
			}
			return createdTask.data;
		})
});
