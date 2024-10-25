import type { ApprenticeProfileSummary } from '$learning/aggregates/ApprenticeProfileSummary';

export type FetchApprenticeSolution = (id: string) => Promise<string>;
export type FetchApprenticeProfileSummary = (id: string) => Promise<ApprenticeProfileSummary>;
