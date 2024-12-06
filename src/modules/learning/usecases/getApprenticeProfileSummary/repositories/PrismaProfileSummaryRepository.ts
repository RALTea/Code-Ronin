import type { PrismaClient } from '@prisma/client';
import type * as IProfileSummaryRepository from './IProfileSummaryRepository';
import { ApprenticeNotFoundError } from '../errors/ApprenticeNotFoundError';

type _PrismaProfileSummaryRepository = {
	fetchApprenticeInfos: IProfileSummaryRepository.FetchApprenticeInfos;
	fetchApprenticeExp: IProfileSummaryRepository.FetchApprenticeExp;
};

export const PrismaProfileSummaryRepository = (prisma: PrismaClient): _PrismaProfileSummaryRepository => {
	return {
		fetchApprenticeInfos: async (id) => {
			const apprentice = await prisma.apprentice.findUnique({
				where: { id }
			});
			if (!apprentice) throw new ApprenticeNotFoundError(id);
			return {
				name: apprentice.username,
				title: apprentice.title,
				avatar: apprentice.profilePicture,
				medals: []
			};
		},
		fetchApprenticeExp: async (id) => {
			const successfulAttempts = await prisma.attempt.findMany({
				where: { apprenticeId: id, isSuccess: true },
				select: { tasks: { select: { exp: true } } },
				distinct: ['taskId']
			});

			const exp = successfulAttempts.reduce((acc, attempt) => acc + attempt.tasks.exp, 0);
			return exp;
		}
	};
};
