import { z } from 'zod';
import { CampaignInfosSchema } from './CampaignInfos';

export const DashboardCampaignItemSchema = CampaignInfosSchema.extend({
	completion: z.number(),
});

export type DashboardCampaignItem = z.infer<typeof DashboardCampaignItemSchema>;