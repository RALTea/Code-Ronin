import prisma from '$lib/server/db';
import { authProcedure } from '$lib/trpc/middlewares/auth.middleware';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaProgressionRepository } from '../repositories/PrismaProgressionRepository';

const router = t.router({
	getApprenticeAttemptsOnQuest: authProcedure
		.input(
			z.object({
				questId: z.string()
			})
		)
		.query(async ({ input, ctx }) => {
			const progressionRepository = PrismaProgressionRepository(prisma);
			const result = await progressionRepository.getApprenticeAttemptsOnQuest(
				ctx.user.id,
				input.questId
			);
			return result;
		}),
	getTasksFromQuest: authProcedure
		.input(
			z.object({
				questId: z.string()
			})
		)
		.query(async ({ input }) => {
			const progressionRepository = PrismaProgressionRepository(prisma);
			const result = await progressionRepository.getTasksFromQuest(input.questId);
			return result;
		})
});

export default router;
