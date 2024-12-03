import { adminProcedure } from '$lib/trpc/middlewares/admin.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaGetTaskRepository } from '../repositories/PrismaGetTaskRepository';

export const GetTaskDataTRPCRouter = t.router({
	execute: adminProcedure
		.input(
			z.object({
				taskId: z.string().uuid()
			})
		)
		.query(async ({ input, ctx }) => {
			const { taskId } = input;
			return PrismaGetTaskRepository(ctx.prisma).getTaskData(taskId);
		})
});
