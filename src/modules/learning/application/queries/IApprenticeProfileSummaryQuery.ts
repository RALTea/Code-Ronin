import type { ApprenticeProfileSummary } from '../dtos/ApprenticeProfileSummary';

export interface IApprenticeProfileSummaryQuery {
	getProfileInfo(apprenticeId: string): Promise<ApprenticeProfileSummary | null>;
	calculateTotalExp(apprenticeId: string): Promise<number>;
}
