import type { Apprentice } from '@prisma/client';

export type FetchApprenticeSolution = (id: string) => Promise<string>;
export type FetchApprenticeProfileSummary = (id: string) => Promise<Apprentice>;
