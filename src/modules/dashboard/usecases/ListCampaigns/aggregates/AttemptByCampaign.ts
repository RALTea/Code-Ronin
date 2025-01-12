import { z } from 'zod';
import { Attempt } from './Attempt';

export const AttemptsByCampaignSchema = z.object({
	campaignName: z.string(),
	attempts: Attempt.array(),
})

export type AttemptsByCampaign = z.infer<typeof AttemptsByCampaignSchema>;