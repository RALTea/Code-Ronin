import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaGetTaskDetailsRepository } from '../repositories/PrismaGetTaskDetailsRepository';
import type { TaskDetails } from '../aggregates/TaskDetails';

const router = t.router({
	getTaskDetails: t.procedure.input(z.object({
		taskId: z.string(),
	})).query(({input, ctx}): Promise<TaskDetails> => {
		const { taskId } = input;
		return PrismaGetTaskDetailsRepository().run(taskId, ctx.user?.id ?? '-1');
	}),
})
export default router;