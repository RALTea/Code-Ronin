import type { User } from '$auth/entities/User';

export interface IUserRepository {
	addUser(user: Omit<User, 'id'>): Promise<void>;
}

export type IUserRepositoryGetById = {
	getUserById(id: string): Promise<User | undefined>;
}
