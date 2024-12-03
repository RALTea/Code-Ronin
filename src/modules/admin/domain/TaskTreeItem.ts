import { z } from 'zod';

export const TaskTreeItemSchema = z.object({
	name: z.string(),
	id: z.string().uuid(),
	previousTaskIds: z.string().uuid().array().optional(),
	nextTaskIds: z.string().uuid().array().optional(),
});

export type TaskTreeItem = z.infer<typeof TaskTreeItemSchema>;