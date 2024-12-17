import { z } from 'zod';

export const CampaignInfosSchema = z.object({
	id: z.string().uuid(),
	name: z.string()
});

export type CampaignInfos = z.infer<typeof CampaignInfosSchema>;