import { z } from 'zod';

export const QuestSchema = z.object({
	name: z.string(),
	id: z.string().uuid(),
	previousQuestIds: z.string().uuid().array().optional(),
	nextQuestIds: z.string().uuid().array().optional(),
})

export type Quest = z.infer<typeof QuestSchema>;