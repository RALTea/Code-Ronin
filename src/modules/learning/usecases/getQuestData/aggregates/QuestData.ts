import { z } from 'zod';
import { TaskTreeItemSchema } from './TaskTreeItem';

export const QuestDataSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	tasks: TaskTreeItemSchema.array().array(),
})

export type QuestData = z.infer<typeof QuestDataSchema>;