import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { GetQuestDataUseCase } from '../getQuestData';
import { PrismaQuestRepository } from '../repositories/PrismaQuestRepository';

export const GetQuestDataTRPCRouter = t.router({
	load: t.procedure.input(z.object({
		questId: z.string()
	})).query(async ({ input, ctx }) => {
		const prismaRepository = PrismaQuestRepository(ctx.prisma);
		// const inMemoryRepository = InMemoryQuestRepository();
		const questData = await GetQuestDataUseCase({
			fetchQuestData: prismaRepository.getQuestData
		}).execute({
			questId: input.questId
		})
		return questData;
	})
});