import type { Campaign } from '../aggregates/Campaign';

export type GetCampaignByAccessKey = (accessKey: string) => Promise<Campaign | null>;
export type HasUserJoinedCampaign = (userId: string, campaignId: string) => Promise<boolean>;
export type JoinCampaign = (userId: string, campaignId: string) => Promise<void>;
export type TransferProgressionFromDemo = (userId: string, campaignId: string) => Promise<boolean>;
export type GetFirstQuestId = (campaignId: string) => Promise<string | null>;
