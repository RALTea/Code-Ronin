import type { Campaign } from '../aggregates/Campaign';

export type GetCampaignByAccessKey = (accessKey: string) => Promise<Campaign | null>;
export type HasUserJoinedCampaign = (userId: string, campaignId: string) => Promise<boolean>;
export type JoinCampaign = (userId: string, campaignId: string, accessKey: string) => Promise<void>;
export type TransferProgressionFromDemo = (userId: string, campaignId: string) => Promise<boolean>;
export type GetAccessKeyDetails = (accessKey: string) => Promise<{ maxUses: number | null; useCount: number } | null>;
export type GetFirstQuestId = (campaignId: string) => Promise<string | null>;
