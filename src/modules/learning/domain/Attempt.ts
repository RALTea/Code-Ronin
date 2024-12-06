import { z } from 'zod';

export const AttemptSchema = z.object({
	taskId: z.string(),
	date: z.string(),
	success: z.boolean(),
});

export type Attempt = z.infer<typeof AttemptSchema>;