import type { User } from '$auth/entities/User';

export type GetSelfData = (userId: string) => Promise<User>;