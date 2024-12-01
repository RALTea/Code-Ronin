import { z } from 'zod';

export const CreateQuestDtoSchema = z.object({
	name: z.string().min(1).max(255),
	description: z.string().min(1).max(255),
});

export type CreateQuestDto = z.infer<typeof CreateQuestDtoSchema>;