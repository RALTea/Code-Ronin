import { z } from 'zod';
import { UserRoleSchema } from './UserRole';

export const UserSchema = z.object({
	id: z.string(),
	username: z.string(),
	profilePicture: z.string(),
	role: UserRoleSchema,
})

export type User = z.infer<typeof UserSchema>;