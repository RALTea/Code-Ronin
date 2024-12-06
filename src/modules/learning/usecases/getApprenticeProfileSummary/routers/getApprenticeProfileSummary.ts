import prisma from '$lib/server/db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import type * as IProfileSummaryRepository from '../repositories/IProfileSummaryRepository';
import { PrismaProfileSummaryRepository } from '../repositories/PrismaProfileSummaryRepository';
import { ApprenticeNotFoundError } from '../errors/ApprenticeNotFoundError';
import { TRPCError } from '@trpc/server';

const router = t.router({
	getApprenticeInfos: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(
			async ({ input }): Promise<ReturnType<IProfileSummaryRepository.FetchApprenticeInfos>> => {
				const repository = PrismaProfileSummaryRepository(prisma);
				return repository.fetchApprenticeInfos(input.apprenticeId).catch((error) => {
					if (error instanceof ApprenticeNotFoundError) {
						throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
					}
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to fetch apprentice infos'
					});
				});
			}
		),
	getApprenticeExp: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(async ({ input }): Promise<ReturnType<IProfileSummaryRepository.FetchApprenticeExp>> => {
			const repository = PrismaProfileSummaryRepository(prisma);
			return repository.fetchApprenticeExp(input.apprenticeId);
		})
});

export default router;
