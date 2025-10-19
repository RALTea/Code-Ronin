import { ApprenticeNotFoundError } from './errors/ApprenticeNotFoundError';
import type { IApprenticeProfileSummaryQuery } from './queries/IApprenticeProfileSummaryQuery';

export class GetApprenticeInfoUseCase {
	constructor(private readonly profileQuery: IApprenticeProfileSummaryQuery) {}
	async execute({ apprenticeId }: { apprenticeId: string }) {
		const info = await this.profileQuery.getProfileInfo(apprenticeId);
		if (!info) throw new ApprenticeNotFoundError(apprenticeId);
		return info;
	}
}
