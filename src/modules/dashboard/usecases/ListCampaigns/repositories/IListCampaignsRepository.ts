import type { CampaignCompletion } from '../aggregates/CampaignCompletion';
import type { CampaignInfos } from '../aggregates/CampaignInfos'

export type ListCampaignsJoinedByUser = (userId?: string) => Promise<CampaignInfos[]>;
export type GetCompletionByCampaign = (campaignNames: string[], userId: string) => Promise<CampaignCompletion[]>;