import type { ApprenticeProfileSummary } from '../aggregates/ApprenticeProfileSummary';

export type FetchApprenticeProfileSummary = (id: string) => Promise<ApprenticeProfileSummary>;