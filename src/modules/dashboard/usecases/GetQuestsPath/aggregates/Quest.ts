import { z } from 'zod';

export const QuestSchema = z.object({
	name: z.string(),
	id: z.string().uuid(),
	previousTaskIds: z.string().uuid().array().optional(),
	nextTaskIds: z.string().uuid().array().optional(),
})

export type Quest = z.infer<typeof QuestSchema>;