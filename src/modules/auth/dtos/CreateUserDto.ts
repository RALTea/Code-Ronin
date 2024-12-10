import { z } from 'zod';

export const CreateUserDtoSchema = z.object({
	email: z.string().email(),
	profilePicture: z.string(),
	username: z.string().min(1)
});

export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;