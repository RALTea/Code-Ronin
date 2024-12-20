import { z } from 'zod';

export const QuickActionsSchema = z.object({
	nextItemLink: z.string().optional()
});

export type QuickActions = z.infer<typeof QuickActionsSchema>;
