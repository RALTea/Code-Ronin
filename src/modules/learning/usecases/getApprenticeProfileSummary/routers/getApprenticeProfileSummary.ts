import prisma from '$lib/server/db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import type * as IProfileSummaryRepository from '../repositories/IProfileSummaryRepository';
import { PrismaProfileSummaryRepository } from '../repositories/PrismaProfileSummaryRepository';

const router = t.router({
	getApprenticeInfos: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(async ({ input }): Promise<ReturnType<IProfileSummaryRepository.FetchApprenticeInfos>> => {
			const repository = PrismaProfileSummaryRepository(prisma);
			return repository.fetchApprenticeInfos(input.apprenticeId);
		}),
	getApprenticeExp: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(async ({ input }): Promise<ReturnType<IProfileSummaryRepository.FetchApprenticeExp>> => {
			const repository = PrismaProfileSummaryRepository(prisma);
			return repository.fetchApprenticeExp(input.apprenticeId);
		})
});

export default router;
