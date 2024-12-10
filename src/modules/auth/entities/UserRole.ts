import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'USER']).catch(() => 'USER' as const);

export type UserRole = z.infer<typeof UserRoleSchema>;