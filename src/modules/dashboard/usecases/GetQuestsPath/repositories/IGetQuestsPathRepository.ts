import type { Quest } from '../aggregates/Quest';

export type ListQuestsFromCampaign = (campaignId: string) => Promise<Quest[]>;
export type ListCompletedQuestsForCampaign = (campaignId: string, userId: string) => Promise<Quest[]>;