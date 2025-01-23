import { z } from 'zod';

export const CampaignSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	slug: z.string().min(1),
	isDemo: z.boolean(),
	closeAt: z.date().nullable(),
	maxParticipants: z.number().optional(),
	currentParticipants: z.number()
});

export type Campaign = z.infer<typeof CampaignSchema>;