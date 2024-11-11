import type { ApprenticeProfileSummary } from '../aggregates/ApprenticeProfileSummary';

export type FetchApprenticeInfos = (
	id: string
) => Promise<Pick<ApprenticeProfileSummary, 'name' | 'title' | 'avatar' | 'medals'>>;

export type FetchApprenticeExp = (id: string) => Promise<number>;