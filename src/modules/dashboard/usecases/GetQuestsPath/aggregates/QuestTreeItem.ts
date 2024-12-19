import { z } from 'zod';
import { QuestSchema } from './Quest';

export const QuestTreeItem = QuestSchema.extend({
	isCompleted: z.boolean().default(false),
	isLocked: z.boolean().default(true),
});
export type QuestTreeItem = z.infer<typeof QuestTreeItem>;
