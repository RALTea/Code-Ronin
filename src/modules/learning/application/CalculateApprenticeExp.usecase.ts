import type { IApprenticeProfileSummaryQuery } from './queries/IApprenticeProfileSummaryQuery';

export class CalculateApprenticeExpUseCase {
	constructor(private readonly profileQuery: IApprenticeProfileSummaryQuery) {}
	async execute({ apprenticeId }: { apprenticeId: string }) {
		// Here, we assume if the apprentice doesn't exist, the exp is 0.
		// The query can handle this check.
		return this.profileQuery.calculateTotalExp(apprenticeId);
	}
}
