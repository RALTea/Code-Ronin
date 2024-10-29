import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaGetTaskDetailsRepository } from '../repositories/PrismaGetTaskDetailsRepository';

const router = t.router({
	getTaskDetails: t.procedure.input(z.object({
		taskId: z.string(),
	})).query(({input}) => {
		const { taskId } = input;
		return PrismaGetTaskDetailsRepository().run(taskId);
	}),
})
export default router;