import { z } from 'zod';

export const CampaignInfosSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	slug: z.string(),
	nbOfTasks: z.number(),
});

export type CampaignInfos = z.infer<typeof CampaignInfosSchema>;