import { z } from 'zod';

export const TreeItemSchema = z.object({
	id: z.string().uuid(),
	previousItemsIds: z.string().uuid().array().optional().default([]),
	nextItemsIds: z.string().uuid().array().optional().default([]),
	isLocked: z.boolean().optional().default(false),
	isCompleted: z.boolean().optional().default(false),
});

export type TreeItem = z.infer<typeof TreeItemSchema>;