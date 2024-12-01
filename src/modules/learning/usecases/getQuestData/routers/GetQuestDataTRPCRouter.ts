import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PrismaQuestRepository } from '../repositories/PrismaQuestRepository';
import { GetQuestDataUseCase } from '../getQuestData';
import { InMemoryQuestRepository } from '../repositories/InMeoryQuestRepository';

export const GetQuestDataTRPCRouter = t.router({
	load: t.procedure.input(z.object({
		questId: z.string()
	})).query(async ({ input, ctx }) => {
		const prismaRepository = PrismaQuestRepository(ctx.prisma);
		const inMemoryRepository = InMemoryQuestRepository();
		const questData = await GetQuestDataUseCase({
			fetchQuestData: inMemoryRepository.getQuestData
		}).execute({
			questId: input.questId
		})
		return questData;
	})
});