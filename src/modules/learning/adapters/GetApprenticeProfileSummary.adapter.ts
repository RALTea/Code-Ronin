import { DomainError } from '$ddd/errors/DomainError';
import { CalculateApprenticeExpUseCase } from '$learning/application/CalculateApprenticeExp.usecase';
import { GetApprenticeInfoUseCase } from '$learning/application/GetApprenticeProfileSummary.usecase';
import { PrismaApprenticeProfileSummaryQuery } from '$learning/application/queries/PrismaApprenticeProfileSummaryQuery';
import { AppError } from '$lib/errors/AppError';
import prisma from '$lib/server/db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

const query = new PrismaApprenticeProfileSummaryQuery(prisma);
const getApprenticeInfo = new GetApprenticeInfoUseCase(query);
const calculateApprenticeExp = new CalculateApprenticeExpUseCase(query);

const router = t.router({
	getApprenticeInfos: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(async ({ input }) => {
			return getApprenticeInfo.execute(input);
		}),

	getApprenticeExp: t.procedure
		.input(z.object({ apprenticeId: z.string() }))
		.query(async ({ input }) => {
			try {
				return await calculateApprenticeExp.execute(input);
			} catch (error) {
				let errorMessage = 'An unexpected error occurred';
				if (error instanceof AppError || error instanceof Error || error instanceof DomainError) {
					errorMessage = error.message;
				}
				return { success: false, message: errorMessage };
			}
		})
});

export default router;
