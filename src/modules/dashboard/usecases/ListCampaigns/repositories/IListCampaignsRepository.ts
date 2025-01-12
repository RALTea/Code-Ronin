import type { CampaignCompletion } from '../aggregates/CampaignCompletion';
import type { CampaignInfos } from '../aggregates/CampaignInfos'

export type ListCampaignsJoinedByUser = (userId?: string) => Promise<CampaignInfos[]>;
export type GetCompletionByCampaign = (campaigns: CampaignInfos[], userId?: string) => Promise<CampaignCompletion[]>;