import type { Quest } from '../aggregates/Quest';

export type ListQuestsFromCampaign = (campaignId: string) => Promise<Quest[]>;