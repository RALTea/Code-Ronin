import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaQuickActionsRepository } from '../repositories/PrismaQuickActionsRepository';

export const QuickActionsRouter = t.router({
	listTasksCompletedByUserForQuest: authProcedure
	.input(z.object({
		questId: z.string().uuid(),
	}))
	.query(({ input, ctx }) => {
		const { questId } = input;
		const repository = PrismaQuickActionsRepository(ctx.prisma);
		return repository.ListTasksCompletedByUserForQuest(questId, ctx.user.id);
	})
})