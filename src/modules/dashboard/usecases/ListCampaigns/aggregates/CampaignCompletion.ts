import { z } from 'zod';

export const CampaignCompletionSchema = z.object({
	campaignName: z.string(),
	completion: z.number().default(0),
});

export type CampaignCompletion = z.infer<typeof CampaignCompletionSchema>;