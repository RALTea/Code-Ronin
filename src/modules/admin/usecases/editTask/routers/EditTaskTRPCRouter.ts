import { TaskDataSchema } from '$admin/domain/TaskData';
import { adminProcedure } from '$lib/trpc/middlewares/admin.middleware';
import { t } from '$lib/trpc/t';
import type { UpdateValidationDto } from '../aggregates/UpdateValidationDto';
import { PrismaEditTaskRepository } from '../repositories/PrismaEditTaskRepository';

export const EditTaskTRPCRouter = t.router({
	saveTaskData: adminProcedure.input(TaskDataSchema).query(async ({ input, ctx }) => {
		const prismaRepository = PrismaEditTaskRepository(ctx.prisma);
		await prismaRepository.saveTaskData(input);
		return;
	}),
	saveValidation: adminProcedure.input(TaskDataSchema).query(async ({ input, ctx }) => {
		const prismaRepository = PrismaEditTaskRepository(ctx.prisma);
		const updateValidationDto: UpdateValidationDto = {
			taskId: input.id,
			...input.validation,
		}
		await prismaRepository.saveValidation(updateValidationDto);
		return;
	}),
});
