// src/modules/learning/application/queries/PrismaApprenticeProfileSummaryQuery.ts

import type { PrismaClient } from '@prisma/client';
import type { IApprenticeProfileSummaryQuery } from './IApprenticeProfileSummaryQuery';
import type { ApprenticeProfileSummary } from '../dtos/ApprenticeProfileSummary';

export class PrismaApprenticeProfileSummaryQuery implements IApprenticeProfileSummaryQuery {
	constructor(private readonly prisma: PrismaClient) {}

	async getProfileInfo(apprenticeId: string): Promise<ApprenticeProfileSummary | null> {
		const apprentice = await this.prisma.apprentice.findUnique({
			where: { id: apprenticeId }
		});

		if (!apprentice) {
			return null;
		}

		const exp = await this.calculateTotalExp(apprenticeId);

		return {
			name: apprentice.username,
			title: apprentice.title,
			avatar: apprentice.profilePicture,
			medals: [],
			exp: exp || 0
		};
	}

	async calculateTotalExp(apprenticeId: string): Promise<number> {
		const successfulAttempts = await this.prisma.attempt.findMany({
			where: {
				apprenticeId: apprenticeId,
				isSuccess: true,
				tasks: {
					is: {
						quest: {}
					}
				}
			},
			select: { tasks: { select: { exp: true } } },
			distinct: ['taskId']
		});

		if (!successfulAttempts || successfulAttempts.length === 0) {
			return 0;
		}

		const exp = successfulAttempts.reduce((acc, attempt) => acc + (attempt.tasks?.exp || 0), 0);
		return exp;
	}
}
