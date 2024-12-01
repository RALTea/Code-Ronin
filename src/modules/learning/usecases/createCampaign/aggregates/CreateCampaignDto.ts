import { z } from 'zod';

export const CreateCampaignDtoSchema = z.object({
	name: z.string().min(1).max(255),
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignDtoSchema>;