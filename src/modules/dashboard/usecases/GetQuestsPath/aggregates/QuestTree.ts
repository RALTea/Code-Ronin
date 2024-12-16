import { z } from 'zod';
import { QuestSchema } from './Quest';

export const QuestTreeItem = QuestSchema.extend({
	isCompleted: z.boolean().default(false),
});

export const QuestTreeSchema = QuestTreeItem.array().array();

export type QuestTreeItem = z.infer<typeof QuestTreeItem>;
export type QuestTree = z.infer<typeof QuestTreeSchema>;
