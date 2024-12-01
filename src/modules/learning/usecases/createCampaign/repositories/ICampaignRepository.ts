import type { CreateCampaignDto } from '../aggregates/CreateCampaignDto';

export type CreateCampaign = (data: CreateCampaignDto) => Promise<void>;