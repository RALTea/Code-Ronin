import { z } from 'zod';

export const QuestTreeItemSchema = z.object({
	id: z.string().uuid(),
	previousQuestIds: z.string().uuid().array().optional().default([]),
	nextQuestIds: z.string().uuid().array().optional().default([]),
	isLocked: z.boolean().optional().default(false),
	isCompleted: z.boolean().optional().default(false),
});

export type QuestTreeItem = z.infer<typeof QuestTreeItemSchema>;